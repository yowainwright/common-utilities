import { applyNewU, generateNewU, NewUError } from "./new-u.ts";
import type { NewUInput } from "./types.ts";

const route = "/new-u";

export function createNewURouter() {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname !== route) {
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
  const description = body.description;
  const name = body.name;
  const targetDirectory = body.targetDirectory;
  const hasStrings = [description, name, targetDirectory].every(
    (value) => typeof value === "string",
  );

  if (
    !hasStrings ||
    typeof description !== "string" ||
    typeof name !== "string" ||
    typeof targetDirectory !== "string"
  ) {
    throw new NewUError(
      "invalid-input",
      "description, name, and targetDirectory are required strings.",
      400,
    );
  }

  return { description, name, targetDirectory };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
