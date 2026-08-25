import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createNewURouter } from "./utils.ts";

describe("new-u REST resource", () => {
  it("returns a preview resource for a POST", async () => {
    const router = createNewURouter();
    const response = await router(
      new Request("http://localhost/new-u", {
        body: JSON.stringify({
          description: "A REST-created helper",
          name: "rest-helper",
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
      const router = createNewURouter();
      const response = await router(
        new Request("http://localhost/new-u", {
          body: JSON.stringify({
            description: "A REST-created helper",
            name: "rest-created",
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
    const router = createNewURouter();
    const response = await router(
      new Request("http://localhost/new-u", {
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
