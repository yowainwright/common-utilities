import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins/bearer";
import type { AuthenticatedUser } from "./types.ts";

const authBaseUrl = process.env.BETTER_AUTH_URL ?? "http://127.0.0.1";
const commonApiKey = apiKey({
  enableSessionForAPIKeys: true,
  rateLimit: { enabled: false },
});

const commonAuth = betterAuth({
  appName: "common-utilities",
  baseURL: authBaseUrl,
  plugins: [bearer(), commonApiKey],
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: readSocialProviders(),
});
const commonAuthApi = commonAuth.api as unknown as BetterAuthApi;

export type BetterAuthApi = Readonly<{
  getSession: (context: { headers: Headers }) => Promise<unknown>;
  verifyApiKey: (context: { body: { key: string } }) => Promise<unknown>;
}>;

export function handleBetterAuthRequest(request: Request) {
  return commonAuth.handler(request);
}

export async function authorizeBetterAuthRequest(
  request: Request,
  authApi: BetterAuthApi = commonAuthApi,
) {
  const sessionUser = await readSessionUser(request, authApi);

  if (sessionUser) {
    return sessionUser;
  }

  return readApiKeyUser(request, authApi);
}

async function readSessionUser(request: Request, authApi: BetterAuthApi) {
  try {
    const session = await authApi.getSession({
      headers: request.headers,
    });

    return readAuthenticatedUser(session);
  } catch {
    return null;
  }
}

async function readApiKeyUser(request: Request, authApi: BetterAuthApi) {
  const key = readApiKey(request);

  if (!key) {
    return null;
  }

  try {
    const result = await authApi.verifyApiKey({ body: { key } });

    return readApiKeyAuthenticatedUser(result);
  } catch {
    return null;
  }
}

function readApiKey(request: Request) {
  const headerKey = readHeaderValue(request.headers, "x-api-key");

  if (headerKey) {
    return headerKey;
  }

  return readBearerToken(request.headers.get("authorization"));
}

function readHeaderValue(headers: Headers, name: string) {
  const value = headers.get(name)?.trim();

  if (value) {
    return value;
  }

  return null;
}

function readBearerToken(authorization: string | null) {
  if (!authorization) {
    return null;
  }

  const prefix = "bearer ";
  const hasBearerPrefix = authorization.toLowerCase().startsWith(prefix);

  if (!hasBearerPrefix) {
    return null;
  }

  const token = authorization.slice(prefix.length).trim();

  if (token) {
    return token;
  }

  return null;
}

function readApiKeyAuthenticatedUser(
  verification: unknown,
): AuthenticatedUser | null {
  if (!isRecord(verification)) {
    return null;
  }

  if (verification.valid !== true) {
    return null;
  }

  return readApiKeyOwner(verification.key);
}

function readApiKeyOwner(key: unknown): AuthenticatedUser | null {
  if (!isRecord(key)) {
    return null;
  }

  const id = readUserId(key.referenceId);

  if (!id) {
    return null;
  }

  return {
    id,
    login: readText(key.name),
    name: readText(key.name),
  };
}

function readSocialProviders() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId) {
    return {};
  }

  if (!clientSecret) {
    return {};
  }

  return {
    github: {
      clientId,
      clientSecret,
    },
  };
}

function readAuthenticatedUser(session: unknown): AuthenticatedUser | null {
  if (!isRecord(session)) {
    return null;
  }

  const user = session.user;

  if (!isRecord(user)) {
    return null;
  }

  const id = readUserId(user.id);

  if (!id) {
    return null;
  }

  return {
    email: readText(user.email),
    id,
    login: readLogin(user),
    name: readText(user.name),
  };
}

function readUserId(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

function readLogin(user: Record<string, unknown>) {
  const username = readText(user.username);

  if (username) {
    return username;
  }

  const login = readText(user.login);

  if (login) {
    return login;
  }

  return null;
}

function readText(value: unknown) {
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
