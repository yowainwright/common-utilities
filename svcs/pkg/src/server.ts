import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { createNewURouter } from "./rest.ts";

const maxBodyBytes = 1_000_000;

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
): Promise<string | null> {
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
