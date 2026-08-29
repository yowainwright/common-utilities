import assert from "node:assert/strict";
import { get, type IncomingHttpHeaders, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import type { AuthenticatedUser } from "../../src/types.ts";
import { createNewUServer } from "../../src/utils.ts";

const authorization = "Bearer test-token";

test("createNewUServer serves alive over HTTP", async (t) => {
  const server = createNewUServer({ authorize: authorizeTestRequest });
  const baseUrl = await listen(server);

  t.after(async () => {
    await close(server);
  });

  const response = await fetch(`${baseUrl}/api/v1/alive`);
  const body = await response.json();

  assert.strictEqual(response.status, 200);
  assert.strictEqual(body.data.status, "alive");
});

test("createNewUServer serves protected package reads over HTTP", async (t) => {
  const server = createNewUServer({ authorize: authorizeTestRequest });
  const baseUrl = await listen(server);

  t.after(async () => {
    await close(server);
  });

  const response = await fetch(`${baseUrl}/api/v1/packages?kind=util&q=head`, {
    headers: { authorization },
  });
  const body = await response.json();

  assert.strictEqual(response.status, 200);
  assert.strictEqual(body.data[0].slug, "head");
});

test("createNewUServer preserves multiple auth Set-Cookie headers", async (t) => {
  const cookies = [
    "oauth_state=one; Path=/; HttpOnly",
    "session=two; Path=/; HttpOnly",
  ];
  const server = createNewUServer({
    authHandler: async () => {
      const headers = new Headers();

      cookies.forEach((cookie) => {
        headers.append("Set-Cookie", cookie);
      });

      return new Response("ok", { headers });
    },
  });
  const baseUrl = await listen(server);

  t.after(async () => {
    await close(server);
  });

  const response = await getRawResponse(`${baseUrl}/api/auth/session`);

  assert.strictEqual(response.statusCode, 200);
  assert.deepStrictEqual(response.headers["set-cookie"], cookies);
});

type RawResponse = Readonly<{
  headers: IncomingHttpHeaders;
  statusCode: number;
}>;

async function authorizeTestRequest(
  request: Request,
): Promise<AuthenticatedUser | null> {
  const requestAuthorization = request.headers.get("authorization");
  const hasTestAuthorization = requestAuthorization === authorization;

  if (!hasTestAuthorization) {
    return null;
  }

  return { id: "1", login: "test-user" };
}

function listen(httpServer: Server) {
  return new Promise<string>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.once("listening", () => {
      const address = httpServer.address() as AddressInfo;
      const url = `http://127.0.0.1:${address.port}`;

      resolve(url);
    });
    httpServer.listen(0, "127.0.0.1");
  });
}

function close(httpServer: Server) {
  return new Promise<void>((resolve, reject) => {
    httpServer.close((error) => {
      if (error) {
        reject(error);

        return;
      }

      resolve();
    });
  });
}

function getRawResponse(url: string) {
  return new Promise<RawResponse>((resolve, reject) => {
    const request = get(url, (response) => {
      response.resume();
      response.once("end", () => {
        const statusCode = response.statusCode ?? 0;

        resolve({
          headers: response.headers,
          statusCode,
        });
      });
    });

    request.once("error", reject);
  });
}
