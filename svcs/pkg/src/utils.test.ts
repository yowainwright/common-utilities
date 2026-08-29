import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createDiff,
  createFiles,
  createProvenance,
  toFunctionName,
} from "./utils.ts";

test("createFiles returns the scaffold files sorted by path", () => {
  const files = createFiles("first-item", "A small array helper");

  assert.deepStrictEqual(files.map(({ path }) => path), [
    "README.md",
    "package.json",
    "src/index.test.ts",
    "src/index.ts",
    "tsconfig.json",
  ]);
});

test("createFiles creates a package.json that exports the build entry", () => {
  const files = createFiles("first-item", "A small array helper");
  const packageJsonContent =
    files.find(({ path }) => path === "package.json")?.content ?? "{}";

  assert.deepStrictEqual(JSON.parse(packageJsonContent), {
    name: "@common-utilities/first-item",
    version: "0.0.1",
    description: "A small array helper",
    type: "module",
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        default: "./dist/index.js",
      },
    },
    main: "./dist/index.js",
    module: "./dist/index.js",
    private: true,
    scripts: {
      build: "tsc",
      "tsc:check": "tsc --noEmit",
    },
    types: "./dist/index.d.ts",
    license: "MIT",
  });
});

test("createFiles creates an index that exports the camelCase function", () => {
  const files = createFiles("first-item", "A small array helper");
  const indexContent =
    files.find(({ path }) => path === "src/index.ts")?.content ?? "";

  assert.match(indexContent, /export const firstItem/);
  assert.match(indexContent, /export default firstItem/);
});

test("createDiff builds a new-file patch with one addition per line", () => {
  const diff = createDiff({ content: "first\nsecond\n", path: "src/index.ts" });

  assert.strictEqual(diff.path, "src/index.ts");
  assert.strictEqual(diff.additions, 2);
  assert.strictEqual(diff.deletions, 0);
  assert.match(diff.patch, /^diff --git a\/src\/index\.ts b\/src\/index\.ts/);
  assert.match(diff.patch, /new file mode 100644/);
  assert.match(diff.patch, /\+first\n\+second/);
});

test("createProvenance digests the files and reports stable metadata", () => {
  const files = createFiles("first-item", "A small array helper");
  const provenance = createProvenance(files);

  assert.match(provenance.digest, /^sha256:[a-f0-9]{64}$/);
  assert.strictEqual(provenance.digest, createProvenance(files).digest);
  assert.deepStrictEqual(provenance.dependencies, []);
  assert.strictEqual(provenance.license, "MIT");
  assert.deepStrictEqual(provenance.tests, ["src/index.test.ts"]);
});

test("createProvenance changes the digest when file content changes", () => {
  const files = createFiles("first-item", "A small array helper");
  const changed = createFiles("first-item", "A different description");

  assert.notStrictEqual(
    createProvenance(files).digest,
    createProvenance(changed).digest,
  );
});

test("toFunctionName camelCases hyphenated names", () => {
  assert.strictEqual(toFunctionName("first-item"), "firstItem");
  assert.strictEqual(toFunctionName("get-2nd-item"), "get2ndItem");
  assert.strictEqual(toFunctionName("single"), "single");
});
