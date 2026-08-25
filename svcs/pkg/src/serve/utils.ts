import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { applyNewU, generateNewU, NewUError } from "../index.ts";
import type { NewUInput } from "../types.ts";
import { maxBodyBytes, routes } from "./constants.ts";
import type { ServeBody } from "./types.ts";

export function createNewURouter() {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    if (!routes.has(url.pathname)) {
      return problem(
        404,
        "not-found",
        "The requested resource does not exist.",
      );
    }

    if (request.method !== "POST") {
      return new Response(null, { headers: { Allow: "POST" }, status: 405 });
    }

    return handleCreate(request);
  };
}

async function handleCreate(request: Request) {
  try {
    const { input, write } = await parseRequest(request);
    const resource = write ? applyNewU(input) : generateNewU(input);

    return json(resource, write ? 201 : 200);
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
    "name",
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
  const name = readString(body.name);
  const targetDirectory = readString(body.targetDirectory);

  return { description, name, targetDirectory };
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

function toProblem(error: unknown) {
  if (error instanceof NewUError) {
    return problem(error.status, error.code, error.message);
  }

  return problem(500, "internal-error", "The request could not be completed.");
}

export function createNewUServer() {
  const router = createNewURouter();

  return createServer(async (request, response) => {
    const body = await readBody(request, response);

    if (body === null) {
      return;
    }

    const isBodylessRequest =
      request.method === "GET" || request.method === "HEAD";
    const requestBody = isBodylessRequest ? undefined : body;
    const webRequest = new Request(`http://localhost${request.url ?? "/"}`, {
      body: requestBody,
      headers: toHeaders(request),
      method: request.method,
    });
    const webResponse = await router(webRequest);

    response.writeHead(webResponse.status, toResponseHeaders(webResponse));
    response.end(await webResponse.text());
  });
}

async function readBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<ServeBody> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;

    if (size > maxBodyBytes) {
      response.writeHead(413, { "Content-Type": "application/problem+json" });
      response.end(
        JSON.stringify({
          detail: "Request body is too large.",
          status: 413,
          title: "payload-too-large",
          type: "about:blank",
        }),
      );
      return null;
    }

    const chunkIndex = chunks.length;
    chunks[chunkIndex] = buffer;
  }

  return Buffer.concat(chunks).toString("utf8");
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

function toResponseHeaders(response: Response) {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, name) => {
    headers[name] = value;
  });
  return headers;
}
