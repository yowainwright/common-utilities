import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import type { AuthenticatedUser } from "../../src/types.ts";
import { createNewUServer } from "../../src/utils.ts";

const authorization = "Bearer test-token";
let baseUrl = "";
let server: Server | null = null;

describe("new-u HTTP integration", () => {
  before(async () => {
    server = createNewUServer({ authorize: authorizeTestRequest });
    baseUrl = await listen(server);
  });

  after(async () => {
    if (server) {
      await close(server);
    }
  });

  it("serves alive over HTTP", async () => {
    const response = await fetch(`${baseUrl}/api/v1/alive`);
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(body.data.status, "alive");
  });

  it("serves protected package reads over HTTP", async () => {
    const response = await fetch(`${baseUrl}/api/v1/packages?kind=util&q=head`, {
      headers: { authorization },
    });
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(body.data[0].slug, "head");
  });
});

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
