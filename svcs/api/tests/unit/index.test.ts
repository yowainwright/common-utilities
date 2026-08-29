import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createNewUApp, createNewURouter } from "../../src/utils.ts";

const authHeaders = { Authorization: "Bearer test-token" };

describe("new-u REST resource", () => {
  it("returns health without requiring a request body", async () => {
    const router = createNewURouter();
    const response = await router(
      new Request("http://localhost/api/v1/health", { method: "GET" }),
    );
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(body, {
      data: {
        service: "common-utilities-api",
        status: "ok",
        version: "0.0.1",
      },
    });
  });

  it("returns alive and ready without auth", async () => {
    const router = createNewURouter();
    const aliveResponse = await router(
      new Request("http://localhost/api/v1/alive"),
    );
    const readyResponse = await router(
      new Request("http://localhost/api/v1/ready"),
    );
    const alive = await aliveResponse.json();
    const ready = await readyResponse.json();

    assert.strictEqual(aliveResponse.status, 200);
    assert.strictEqual(alive.data.status, "alive");
    assert.strictEqual(readyResponse.status, 200);
    assert.strictEqual(ready.data.status, "ready");
    assert.ok(ready.data.checks.registry.count > 0);
  });

  it("creates a Koa request handler", () => {
    const app = createNewUApp();

    assert.equal(typeof app.callback(), "function");
  });

  it("routes Better Auth endpoints through the auth handler", async () => {
    let routedPath = "";
    const router = createNewURouter({
      authHandler: async (request) => {
        routedPath = new URL(request.url).pathname;

        return new Response(null, { status: 204 });
      },
    });
    const response = await router(
      new Request("http://localhost/api/auth/session"),
    );

    assert.strictEqual(response.status, 204);
    assert.strictEqual(routedPath, "/api/auth/session");
  });

  it("protects package routes with Better Auth", async () => {
    const router = createNewURouter();
    const response = await router(
      new Request("http://localhost/api/v1/packages?q=head"),
    );
    const body = await response.json();

    assert.strictEqual(response.status, 401);
    assert.strictEqual(body.title, "unauthorized");
    assert.strictEqual(
      response.headers.get("WWW-Authenticate"),
      "Bearer realm=\"common-utilities\"",
    );
  });

  it("rate limits protected routes by authenticated user", async () => {
    const router = createAuthedRouter({
      cache: false,
      rateLimit: {
        limit: 1,
        now: () => 1_000,
        windowMs: 60_000,
      },
    }, { id: "77", login: "limited-user" });
    const firstResponse = await router(
      authedRequest("http://localhost/api/v1/packages?kind=util&q=head"),
    );
    const secondResponse = await router(
      authedRequest("http://localhost/api/v1/packages?kind=util&q=head"),
    );
    const second = await secondResponse.json();

    assert.strictEqual(firstResponse.status, 200);
    assert.strictEqual(firstResponse.headers.get("RateLimit-Limit"), "1");
    assert.strictEqual(firstResponse.headers.get("RateLimit-Remaining"), "0");
    assert.strictEqual(secondResponse.status, 429);
    assert.strictEqual(second.title, "rate-limit-exceeded");
    assert.strictEqual(secondResponse.headers.get("Retry-After"), "60");
  });

  it("caches repeated GET package reads", async () => {
    const router = createAuthedRouter({
      cache: {
        now: () => 1_000,
      },
      rateLimit: false,
    }, { id: "88", login: "cache-user" });
    const firstResponse = await router(
      authedRequest("http://localhost/api/v1/packages?kind=util&q=cache-test"),
    );
    const secondResponse = await router(
      authedRequest("http://localhost/api/v1/packages?kind=util&q=cache-test"),
    );

    assert.strictEqual(firstResponse.status, 200);
    assert.strictEqual(firstResponse.headers.get("X-Cache"), "MISS");
    assert.strictEqual(
      firstResponse.headers.get("Cache-Control"),
      "private, max-age=1209600",
    );
    assert.strictEqual(firstResponse.headers.get("X-Registry-Version"), "0.0.1");
    assert.strictEqual(secondResponse.status, 200);
    assert.strictEqual(secondResponse.headers.get("X-Cache"), "HIT");
  });

  it("resolves packages by query", async () => {
    const router = createAuthedRouter();
    const response = await router(
      authedRequest("http://localhost/api/v1/packages?kind=util&q=head"),
    );
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(body.data[0].group, "arr");
    assert.strictEqual(body.data[0].kind, "util");
    assert.strictEqual(body.data[0].slug, "head");
    assert.ok(body.data[0].score > 0);
  });

  it("returns package detail from the registry", async () => {
    const router = createAuthedRouter();
    const response = await router(
      authedRequest("http://localhost/api/v1/packages/util/arr/head"),
    );
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(body.data.kind, "util");
    assert.strictEqual(body.data.name, "@common-utilities/head");
    assert.deepStrictEqual(body.data.tags.includes("array"), true);
    assert.deepStrictEqual(body.data.codeBlocks[0], {
      id: 0,
      key: "source",
      kind: "source",
      language: "ts",
      path: "src/index.ts",
    });
  });

  it("returns service package detail from the registry", async () => {
    const router = createAuthedRouter();
    const response = await router(
      authedRequest("http://localhost/api/v1/packages/svc/core/api"),
    );
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(body.data.kind, "svc");
    assert.strictEqual(body.data.slug, "api");
    assert.strictEqual(body.data.paths.source, "svcs/api/src/index.ts");
  });

  it("returns package representation branches", async () => {
    const router = createAuthedRouter();
    const readmeResponse = await router(
      authedRequest("http://localhost/api/v1/packages/util/arr/head/readme"),
    );
    const installUrl = "http://localhost/api/v1/packages/util/arr/head/install/pnpm";
    const installResponse = await router(
      authedRequest(installUrl),
    );
    const readme = await readmeResponse.json();
    const install = await installResponse.json();

    assert.strictEqual(readmeResponse.status, 200);
    assert.match(readme.data.markdown, /@common-utilities\/head/);
    assert.strictEqual(installResponse.status, 200);
    assert.strictEqual(install.data.command, "pnpm add @common-utilities/head");
    assert.strictEqual(install.data.dependencyFree, true);
  });

  it("returns tags, patterns, usage, setup, and tests branches", async () => {
    const router = createAuthedRouter();
    const tagsResponse = await router(
      authedRequest("http://localhost/api/v1/packages/util/arr/head/tags"),
    );
    const patternsResponse = await router(
      authedRequest("http://localhost/api/v1/packages/util/arr/head/patterns"),
    );
    const usageResponse = await router(
      authedRequest("http://localhost/api/v1/packages/util/arr/head/usage/all"),
    );
    const setupUrl = "http://localhost/api/v1/packages/util/arr/head/setup/source";
    const setupResponse = await router(
      authedRequest(setupUrl),
    );
    const testsResponse = await router(
      authedRequest("http://localhost/api/v1/packages/util/arr/head/tests"),
    );
    const tags = await tagsResponse.json();
    const patterns = await patternsResponse.json();
    const usage = await usageResponse.json();
    const setup = await setupResponse.json();
    const tests = await testsResponse.json();

    assert.strictEqual(tagsResponse.status, 200);
    assert.ok(tags.data.tags.includes("head"));
    assert.strictEqual(patternsResponse.status, 200);
    assert.strictEqual(patterns.data.patterns[0].source, "registry");
    assert.strictEqual(usageResponse.status, 200);
    assert.strictEqual(usage.data.kind, "all");
    assert.strictEqual(setupResponse.status, 200);
    assert.strictEqual(setup.data.target, "src/head.ts");
    assert.strictEqual(testsResponse.status, 200);
    assert.match(tests.data.code, /it returns the first item/);
  });

  it("returns code blocks by numeric id or key", async () => {
    const router = createAuthedRouter();
    const numericUrl = "http://localhost/api/v1/packages/util/arr/head/code-blocks/0";
    const numericResponse = await router(
      authedRequest(numericUrl),
    );
    const keyResponse = await router(
      authedRequest(
        "http://localhost/api/v1/packages/util/arr/head/code-blocks/tests",
      ),
    );
    const numeric = await numericResponse.json();
    const key = await keyResponse.json();

    assert.strictEqual(numericResponse.status, 200);
    assert.strictEqual(numeric.data.key, "source");
    assert.match(numeric.data.code, /export const head/);
    assert.strictEqual(keyResponse.status, 200);
    assert.strictEqual(key.data.kind, "test");
  });

  it("returns a preview resource for a POST", async () => {
    const router = createAuthedRouter();
    const response = await router(
      authedRequest("http://localhost/api/v1/packages", {
        body: JSON.stringify({
          description: "A REST-created helper",
          identity: {
            group: "arr",
            kind: "util",
            slug: "rest-helper",
          },
          targetDirectory: process.cwd(),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );
    const body = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(body.status, "preview");
    assert.match(response.headers.get("Content-Type") ?? "", /application\/json/);
  });

  it("writes only when the REST request opts in", async () => {
    const targetDirectory = mkdtempSync(join(process.cwd(), "tmp-rest-new-u-"));

    try {
      const router = createAuthedRouter();
      const response = await router(
        authedRequest("http://localhost/api/v1/packages", {
          body: JSON.stringify({
            description: "A REST-created helper",
            identity: {
              group: "arr",
              kind: "util",
              slug: "rest-created",
            },
            targetDirectory,
            write: true,
          }),
          method: "POST",
        }),
      );
      const body = await response.json();

      assert.strictEqual(response.status, 201);
      assert.strictEqual(body.status, "created");
      assert.match(
        readFileSync(join(body.packageDirectory, "README.md"), "utf8"),
        /# rest-created/,
      );
    } finally {
      rmSync(targetDirectory, { force: true, recursive: true });
    }
  });

  it("returns Problem Details for unsupported request fields", async () => {
    const router = createAuthedRouter();
    const response = await router(
      authedRequest("http://localhost/api/v1/packages", {
        body: JSON.stringify({ unsupported: true }),
        method: "POST",
      }),
    );
    const body = await response.json();

    assert.strictEqual(response.status, 400);
    assert.match(
      response.headers.get("Content-Type") ?? "",
      /application\/problem\+json/,
    );
    assert.strictEqual(body.title, "invalid-body");
  });
});

function createAuthedRouter(
  options: Parameters<typeof createNewURouter>[0] = {},
  user = { id: "1", login: "test-user" },
) {
  return createNewURouter({
    ...options,
    authorize: (request) => authorizeTestRequest(request, user),
  });
}

async function authorizeTestRequest(
  request: Request,
  user: { id: string; login: string },
) {
  const authorization = request.headers.get("authorization");

  if (authorization !== authHeaders.Authorization) {
    return null;
  }

  return user;
}

function authedRequest(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  headers.set("Authorization", authHeaders.Authorization);

  return new Request(url, { ...init, headers });
}
