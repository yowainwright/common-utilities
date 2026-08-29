import {
  createServer,
  type IncomingMessage,
} from "node:http";
import { randomUUID } from "node:crypto";
import Koa, { type Context, type Next } from "koa";
import koaPinoLogger from "koa-pino-logger";
import {
  applyNewU,
  generateNewU,
  NewUError,
  type NewUInput,
} from "@common-utilities/pkg";
import {
  authorizeBetterAuthRequest,
  handleBetterAuthRequest,
} from "./auth.ts";
import {
  createPackagePatterns,
  findCodeBlock,
  findPackage,
  readPackageTags,
  resolvePackages,
  toPackageDetail,
  toPackageInstall,
  toPackageReadme,
  toPackageSetup,
  toPackageTests,
  toPackageUsage,
  type PackageRecord,
} from "./registry/index.ts";
import {
  aliveRoute,
  authRouteRoot,
  cacheMaxEntries,
  cacheTtlMs,
  healthRoute,
  maxBodyBytes,
  packageRouteRoot,
  rateLimitMax,
  rateLimitWindowMs,
  readyRoute,
  routes,
} from "./constants.ts";
import type {
  AuthenticatedUser,
  CachedResponse,
  PackageRoute,
  RateLimitBucket,
  RateLimitResult,
  ResponseCacheOptions,
  ServeBody,
  ServeOptions,
} from "./types.ts";

const responseCache = new Map<string, CachedResponse>();
const rateLimitBuckets = new Map<string, RateLimitBucket>();

type PackageRouteResult = Readonly<{
  problem: Response | null;
  route: PackageRoute | null;
}>;

export function createNewURouter(options: ServeOptions = {}) {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const packageRouteResult = readPackageRoute(url.pathname);
    const statusResponse = handleStatusRequest(request, url.pathname);

    if (isAuthRoute(url.pathname)) {
      return handleAuthRequest(request, options);
    }

    if (statusResponse) {
      return statusResponse;
    }

    if (packageRouteResult.problem) {
      return packageRouteResult.problem;
    }

    const authResult = await readAuthResult(request, options);

    if (authResult.problem) {
      return authResult.problem;
    }

    const rateLimit = readRateLimit(request, authResult.user, options);

    if (rateLimit.problem) {
      return rateLimit.problem;
    }

    const cachedResponse = readCachedResponse(request, options);

    if (cachedResponse) {
      return withHeaders(cachedResponse, rateLimit.headers);
    }

    let response: Response;

    if (isPackageResolutionRoute(url.pathname)) {
      response = await handlePackageResolution(request, url);
    } else if (packageRouteResult.route) {
      response = await handlePackage(request, packageRouteResult.route);
    } else if (!routes.has(url.pathname)) {
      response = problem(
        404,
        "not-found",
        "The requested resource does not exist.",
      );
    } else if (request.method !== "POST") {
      response = new Response(null, { headers: { Allow: "POST" }, status: 405 });
    } else {
      response = await handleCreate(request);
    }

    const cacheAwareResponse = await writeCachedResponse(request, response, options);

    return withHeaders(cacheAwareResponse, rateLimit.headers);
  };
}

function isAuthRoute(pathname: string) {
  const isRootAuthRoute = pathname === authRouteRoot;
  const isNestedAuthRoute = pathname.startsWith(`${authRouteRoot}/`);
  const isAuthRoutePath = isRootAuthRoute || isNestedAuthRoute;

  return isAuthRoutePath;
}

function handleAuthRequest(request: Request, options: ServeOptions) {
  const authHandler = options.authHandler ?? handleBetterAuthRequest;

  return authHandler(request);
}

function handleStatusRequest(request: Request, pathname: string) {
  if (pathname === aliveRoute) {
    return handleAlive(request);
  }

  if (pathname === healthRoute) {
    return handleHealth(request);
  }

  if (pathname === readyRoute) {
    return handleReady(request);
  }

  return null;
}

function handleAlive(request: Request) {
  const methodProblem = readGetProblem(request);

  if (methodProblem) {
    return methodProblem;
  }

  return json({
    data: {
      service: "common-utilities-api",
      status: "alive",
    },
  }, 200);
}

function handleHealth(request: Request) {
  const methodProblem = readGetProblem(request);

  if (methodProblem) {
    return methodProblem;
  }

  return json({
    data: {
      service: "common-utilities-api",
      status: "ok",
      version: "0.0.1",
    },
  }, 200);
}

function handleReady(request: Request) {
  const methodProblem = readGetProblem(request);

  if (methodProblem) {
    return methodProblem;
  }

  const packages = resolvePackages("");
  const registryCount = packages.length;
  const isReady = registryCount > 0;
  const status = isReady ? 200 : 503;
  const readiness = isReady ? "ready" : "not-ready";

  return json({
    data: {
      checks: {
        registry: {
          count: registryCount,
          status: readiness,
        },
      },
      service: "common-utilities-api",
      status: readiness,
    },
  }, status);
}

async function handlePackageResolution(request: Request, url: URL) {
  if (request.method === "POST") {
    return handleCreate(request);
  }

  const methodProblem = readGetProblem(request);

  if (methodProblem) {
    return methodProblem;
  }

  const query = readSearchParam(url, "q", "query");
  const kind = readOptionalSearchParam(url, "kind");
  const group = readOptionalSearchParam(url, "group");
  const data = resolvePackages(query, { group, kind });

  return json({ data, meta: { count: data.length, group, kind, query } }, 200);
}

async function handlePackage(request: Request, route: PackageRoute) {
  const methodProblem = readGetProblem(request);

  if (methodProblem) {
    return methodProblem;
  }

  const record = findPackage(route.kind, route.group, route.slug);

  if (!record) {
    return problem(404, "package-not-found", "The package does not exist.");
  }

  if (route.rest.length === 0) {
    return json({ data: toPackageDetail(record) }, 200);
  }

  return handlePackageRepresentation(route.rest, record);
}

async function handlePackageRepresentation(
  rest: readonly string[],
  record: PackageRecord,
) {
  const [resource, detail] = rest;

  if (resource === "tags") {
    return json({ data: { tags: readPackageTags(record) } }, 200);
  }

  if (resource === "patterns") {
    const patterns = await createPackagePatterns(record);

    return json({ data: { patterns } }, 200);
  }

  const isUsageResource = resource === "usage" || resource === "usages";

  if (isUsageResource) {
    return handlePackageUsage(record, detail);
  }

  const isInstallResource = resource === "install" || resource === "installs";

  if (isInstallResource) {
    return handlePackageInstall(record, detail);
  }

  const isSetupResource = resource === "setup" || resource === "setups";

  if (isSetupResource) {
    return handlePackageSetup(record, detail);
  }

  const isCodeBlockResource =
    resource === "code-blocks" || resource === "codeblocks";

  if (isCodeBlockResource) {
    return handlePackageCodeBlocks(record, detail);
  }

  if (resource === "tests") {
    return json({ data: toPackageTests(record) }, 200);
  }

  if (resource === "readme") {
    return json({ data: toPackageReadme(record) }, 200);
  }

  if (resource === "representations") {
    return handlePackageRepresentation([detail ?? "all"], record);
  }

  return problem(404, "representation-not-found", "The package representation does not exist.");
}

function handlePackageUsage(record: PackageRecord, type = "all") {
  const usage = toPackageUsage(record, type);

  if (!usage) {
    return problem(404, "usage-not-found", "The usage representation does not exist.");
  }

  return json({ data: usage }, 200);
}

function handlePackageInstall(record: PackageRecord, packageManager = "copy") {
  const install = toPackageInstall(record, packageManager);

  if (!install) {
    return problem(404, "package-manager-not-found", "The package manager is not supported.");
  }

  return json({ data: install }, 200);
}

function handlePackageSetup(record: PackageRecord, type = "source") {
  const setup = toPackageSetup(record, type);

  if (!setup) {
    return problem(404, "setup-not-found", "The setup representation does not exist.");
  }

  return json({ data: setup }, 200);
}

function handlePackageCodeBlocks(record: PackageRecord, id?: string) {
  if (!id) {
    return json({ data: record.codeBlocks }, 200);
  }

  const codeBlock = findCodeBlock(record, id);

  if (!codeBlock) {
    return problem(404, "code-block-not-found", "The code block does not exist.");
  }

  return json({ data: codeBlock }, 200);
}

function isPackageResolutionRoute(pathname: string) {
  const isPackageRoute = pathname === packageRouteRoot;

  return isPackageRoute;
}

async function handleCreate(request: Request) {
  try {
    const { input, write } = await parseRequest(request);
    const resource = write ? applyNewU(input) : generateNewU(input);
    const status = write ? 201 : 200;

    return json(resource, status);
  } catch (error) {
    return toProblem(error);
  }
}

async function parseRequest(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new NewUError(
      "invalid-json",
      "Request body must be valid JSON.",
      400,
    );
  }

  if (!isRecord(body)) {
    throw new NewUError("invalid-body", "Request body must be an object.", 400);
  }

  const allowedKeys = new Set([
    "description",
    "group",
    "identity",
    "kind",
    "language",
    "name",
    "slug",
    "targetDirectory",
    "write",
  ]);
  const hasUnknownKey = Object.keys(body).some((key) => !allowedKeys.has(key));

  if (hasUnknownKey) {
    throw new NewUError(
      "invalid-body",
      "Request body contains an unsupported property.",
      400,
    );
  }

  if (typeof body.write === "undefined") {
    return { input: readInput(body), write: false };
  }

  if (typeof body.write !== "boolean") {
    throw new NewUError("invalid-write", "Write must be a boolean.", 400);
  }

  return { input: readInput(body), write: body.write };
}

function readInput(body: Record<string, unknown>): NewUInput {
  const description = readString(body.description);
  const identity = readIdentity(body.identity);
  const kind = readOptionalString(body.kind) ?? identity.kind ?? "util";
  const slug = readOptionalString(body.slug) ??
    identity.slug ??
    readOptionalString(body.name);
  const name = readPackageName(kind, slug);
  const targetDirectory = readString(body.targetDirectory);

  return { description, name, targetDirectory };
}

function readPackageName(kind: string, slug: string | null) {
  if (kind !== "util") {
    throw new NewUError(
      "invalid-kind",
      "Only util package creation is currently supported.",
      400,
    );
  }

  if (slug) {
    return slug;
  }

  throw new NewUError(
    "invalid-input",
    "description, slug, and targetDirectory are required strings.",
    400,
  );
}

function readIdentity(value: unknown) {
  if (!isRecord(value)) {
    return { kind: null, slug: null };
  }

  return {
    kind: readOptionalString(value.kind),
    slug: readOptionalString(value.slug),
  };
}

function readString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  throw new NewUError(
    "invalid-input",
    "description, name, and targetDirectory are required strings.",
    400,
  );
}

function readOptionalString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  const isObjectValue = typeof value === "object";
  const hasValue = value !== null;
  const isArrayValue = Array.isArray(value);
  const isRecordValue = isObjectValue && hasValue && !isArrayValue;

  return isRecordValue;
}

function json(value: unknown, status: number) {
  return new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

function problem(status: number, code: string, detail: string) {
  return new Response(
    JSON.stringify({
      detail,
      status,
      title: code,
      type: "about:blank",
    }),
    { headers: { "Content-Type": "application/problem+json" }, status },
  );
}

function problemWithHeaders(
  status: number,
  code: string,
  detail: string,
  headers: HeadersInit,
) {
  const response = problem(status, code, detail);

  Object.entries(headers).forEach(([name, value]) => {
    response.headers.set(name, value);
  });

  return response;
}

function toProblem(error: unknown) {
  if (error instanceof NewUError) {
    return problem(error.status, error.code, error.message);
  }

  return problem(500, "internal-error", "The request could not be completed.");
}

function withHeaders(response: Response, headers: Record<string, string>) {
  const nextResponse = new Response(response.body, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });

  Object.entries(headers).forEach(([name, value]) => {
    nextResponse.headers.set(name, value);
  });

  return nextResponse;
}

async function readAuthResult(request: Request, options: ServeOptions) {
  const shouldRequireAuth = options.requireAuth ?? true;

  if (!shouldRequireAuth) {
    return { problem: null, user: null };
  }

  const authorize = options.authorize ?? authorizeBetterAuthRequest;
  const user = await authorize(request);

  if (user) {
    return { problem: null, user };
  }

  const authProblem = problemWithHeaders(
    401,
    "unauthorized",
    "A valid Better Auth session or API key is required.",
    { "WWW-Authenticate": "Bearer realm=\"common-utilities\"" },
  );

  return { problem: authProblem, user: null };
}

function readRateLimit(
  request: Request,
  user: AuthenticatedUser | null,
  options: ServeOptions,
): RateLimitResult {
  if (options.rateLimit === false) {
    return { headers: {}, problem: null };
  }

  const limit = options.rateLimit?.limit ?? rateLimitMax;
  const now = options.rateLimit?.now?.() ?? Date.now();
  const windowMs = options.rateLimit?.windowMs ?? rateLimitWindowMs;
  const key = readRateLimitKey(request, user);
  const existingBucket = rateLimitBuckets.get(key);
  const bucket = readRateLimitBucket(existingBucket, now, windowMs);
  const isLimited = bucket.count >= limit;
  const resetSeconds = Math.ceil(bucket.resetAt / 1_000);
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000));

  if (isLimited) {
    const headers = readRateLimitHeaders(limit, 0, resetSeconds);
    const response = problemWithHeaders(
      429,
      "rate-limit-exceeded",
      "Too many requests. Try again after the rate limit resets.",
      { ...headers, "Retry-After": String(retryAfter) },
    );

    return { headers, problem: response };
  }

  const count = bucket.count + 1;
  const remaining = Math.max(0, limit - count);
  const nextBucket = { count, resetAt: bucket.resetAt };

  rateLimitBuckets.set(key, nextBucket);

  return {
    headers: readRateLimitHeaders(limit, remaining, resetSeconds),
    problem: null,
  };
}

function readRateLimitBucket(
  bucket: RateLimitBucket | undefined,
  now: number,
  windowMs: number,
) {
  const shouldReset = !bucket || bucket.resetAt <= now;

  if (shouldReset) {
    const resetAt = now + windowMs;

    return { count: 0, resetAt };
  }

  return bucket;
}

function readRateLimitHeaders(
  limit: number,
  remaining: number,
  resetSeconds: number,
) {
  return {
    "RateLimit-Limit": String(limit),
    "RateLimit-Remaining": String(remaining),
    "RateLimit-Reset": String(resetSeconds),
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(resetSeconds),
  };
}

function readRateLimitKey(request: Request, user: AuthenticatedUser | null) {
  if (user) {
    return `auth:${user.id}`;
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const [clientIp] = forwardedFor.split(",", 1);
  const fallbackIp = clientIp?.trim() || "unknown";

  return `ip:${fallbackIp}`;
}

function readCachedResponse(request: Request, options: ServeOptions) {
  if (!isCacheEnabled(request, options)) {
    return null;
  }

  const cacheOptions = readCacheOptions(options);
  const now = cacheOptions.now?.() ?? Date.now();
  const key = readCacheKey(request);
  const cached = responseCache.get(key);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= now) {
    responseCache.delete(key);

    return null;
  }

  return createCachedResponse(cached, "HIT");
}

async function writeCachedResponse(
  request: Request,
  response: Response,
  options: ServeOptions,
) {
  if (!isCacheEnabled(request, options)) {
    return response;
  }

  if (response.status !== 200) {
    return response;
  }

  const cacheOptions = readCacheOptions(options);
  const now = cacheOptions.now?.() ?? Date.now();
  const ttlMs = cacheOptions.ttlMs ?? cacheTtlMs;
  const key = readCacheKey(request);
  const body = await response.clone().text();
  const headers = Array.from(response.headers.entries());
  const expiresAt = now + ttlMs;
  const maxAgeSeconds = Math.ceil(ttlMs / 1_000);
  const registryVersion = readRegistryVersion();
  const cached = {
    body,
    expiresAt,
    headers,
    maxAgeSeconds,
    registryVersion,
    status: response.status,
  };

  responseCache.set(key, cached);
  pruneResponseCache(options);

  return createCachedResponse(cached, "MISS");
}

function isCacheEnabled(request: Request, options: ServeOptions) {
  if (options.cache === false) {
    return false;
  }

  const url = new URL(request.url);
  const isGetMethod = request.method === "GET" || request.method === "HEAD";
  const isPackageDetailRead = readPackageRoute(url.pathname).route !== null;
  const isPackageSearchRead = isPackageResolutionRoute(url.pathname);
  const isPackageRead = isPackageSearchRead || isPackageDetailRead;
  const shouldCache = isGetMethod && isPackageRead;

  return shouldCache;
}

function createCachedResponse(cached: CachedResponse, cacheStatus: string) {
  const response = new Response(cached.body, {
    headers: cached.headers,
    status: cached.status,
  });
  const cacheControl = `private, max-age=${cached.maxAgeSeconds}`;

  response.headers.set("Cache-Control", cacheControl);
  response.headers.set("X-Registry-Version", cached.registryVersion);
  response.headers.set("X-Cache", cacheStatus);

  return response;
}

function readCacheOptions(options: ServeOptions): ResponseCacheOptions {
  if (options.cache === false) {
    return {};
  }

  const cacheOptions = options.cache ?? {};

  return cacheOptions;
}

function readCacheKey(request: Request) {
  const url = new URL(request.url);

  return [
    "registry",
    "v1",
    readRegistryVersion(),
    request.method,
    url.pathname,
    url.searchParams.toString(),
  ].join(":");
}

function readRegistryVersion() {
  const registryVersion =
    process.env.COMMON_UTILITIES_REGISTRY_VERSION ?? "0.0.1";

  return registryVersion;
}

function pruneResponseCache(options: ServeOptions) {
  const cacheOptions = readCacheOptions(options);
  const maxEntries = cacheOptions.maxEntries ?? cacheMaxEntries;

  while (responseCache.size > maxEntries) {
    const [oldestKey] = responseCache.keys();

    if (!oldestKey) {
      return;
    }

    responseCache.delete(oldestKey);
  }
}

function readGetProblem(request: Request) {
  const isGetMethod = request.method === "GET" || request.method === "HEAD";

  if (isGetMethod) {
    return null;
  }

  return new Response(null, { headers: { Allow: "GET, HEAD" }, status: 405 });
}

function readPackageRoute(pathname: string): PackageRouteResult {
  const prefix = `${packageRouteRoot}/`;

  if (!pathname.startsWith(prefix)) {
    return { problem: null, route: null };
  }

  const routePath = pathname.slice(prefix.length);
  const segments = readPathSegments(routePath);

  if (!segments) {
    return {
      problem: problem(
        400,
        "invalid-package-path",
        "The package path must be valid percent-encoded UTF-8.",
      ),
      route: null,
    };
  }

  const [kind, group, slug, ...rest] = segments;
  const hasPackageIdentity = Boolean(kind) && Boolean(group) && Boolean(slug);

  if (!hasPackageIdentity) {
    return { problem: null, route: null };
  }

  return { problem: null, route: { group, kind, rest, slug } };
}

function readPathSegments(routePath: string) {
  try {
    return routePath.split("/").filter(Boolean).map(decodeURIComponent);
  } catch (error) {
    if (error instanceof URIError) {
      return null;
    }

    throw error;
  }
}

function readSearchParam(url: URL, primary: string, fallback: string) {
  const primaryValue = url.searchParams.get(primary)?.trim();
  const fallbackValue = url.searchParams.get(fallback)?.trim();
  const value = primaryValue || fallbackValue || "";

  return value;
}

function readOptionalSearchParam(url: URL, name: string) {
  const value = url.searchParams.get(name)?.trim();

  if (value) {
    return value;
  }

  return undefined;
}

export function createNewUServer(options: ServeOptions = {}) {
  const app = createNewUApp(options);

  return createServer(app.callback());
}

export function createNewUApp(options: ServeOptions = {}) {
  const app = new Koa();
  const router = createNewURouter(options);

  app.use(createRequestIdMiddleware());
  app.use(koaPinoLogger({
    genReqId: readRequestId,
    redact: ["req.headers.authorization"],
  }));
  app.use(async (context) => {
    const webResponse = await routeKoaRequest(context, router);

    await applyWebResponse(context, webResponse);
  });

  return app;
}

function createRequestIdMiddleware() {
  return async (context: Context, next: Next) => {
    const requestId = context.get("x-request-id") || `req_${randomUUID()}`;

    context.req.headers["x-request-id"] = requestId;
    context.state.requestId = requestId;
    context.set("x-request-id", requestId);
    await next();
  };
}

function readRequestId(request: IncomingMessage) {
  const requestId = request.headers["x-request-id"];

  if (typeof requestId === "string") {
    return requestId;
  }

  return `req_${randomUUID()}`;
}

async function routeKoaRequest(
  context: Context,
  router: (request: Request) => Promise<Response>,
) {
  const webRequest = await toWebRequest(context);

  if (webRequest === null) {
    return problem(413, "payload-too-large", "Request body is too large.");
  }

  return router(webRequest);
}

async function readBody(request: IncomingMessage): Promise<ServeBody> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;

    if (size > maxBodyBytes) {
      return null;
    }

    const chunkIndex = chunks.length;
    chunks[chunkIndex] = buffer;
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function toWebRequest(context: Context) {
  const body = await readBody(context.req);

  if (body === null) {
    return null;
  }

  const isBodylessRequest =
    context.method === "GET" || context.method === "HEAD";
  const requestBody = isBodylessRequest ? undefined : body;

  return new Request(`http://localhost${context.url}`, {
    body: requestBody,
    headers: toHeaders(context.req),
    method: context.method,
  });
}

function toHeaders(request: IncomingMessage) {
  const headers = new Headers();

  Object.entries(request.headers).forEach(([name, value]) => {
    if (typeof value === "string") {
      headers.set(name, value);
    }
  });

  return headers;
}

async function applyWebResponse(context: Context, response: Response) {
  context.status = response.status;

  applyResponseHeaders(context, response.headers);
  context.body = await response.text();
}

function applyResponseHeaders(context: Context, headers: Headers) {
  const setCookies = readSetCookieHeaders(headers);

  setCookies.forEach((value) => {
    context.append("Set-Cookie", value);
  });

  headers.forEach((value, name) => {
    if (name.toLowerCase() === "set-cookie") {
      return;
    }

    context.set(name, value);
  });
}

function readSetCookieHeaders(headers: Headers) {
  const headersWithCookies = headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookies = headersWithCookies.getSetCookie?.() ?? [];

  if (setCookies.length > 0) {
    return setCookies;
  }

  const setCookie = headers.get("set-cookie");

  if (setCookie) {
    return [setCookie];
  }

  return [];
}
