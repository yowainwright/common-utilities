import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { applyNewU, generateNewU, NewUError } from "./index.ts";

test("generateNewU returns a TypeScript package preview without writing files", () => {
  const result = generateNewU({
    description: "A small array helper",
    name: "first-item",
    targetDirectory: process.cwd(),
  });

  assert.strictEqual(result.status, "preview");
  assert.deepStrictEqual(result.files.map(({ path }) => path), [
    "README.md",
    "package.json",
    "src/index.test.ts",
    "src/index.ts",
    "tsconfig.json",
  ]);
  assert.match(result.markdown, /# first-item/);
  assert.match(result.diff[0]?.patch ?? "", /new file mode 100644/);
  assert.deepStrictEqual(result.provenance.dependencies, []);
  const packageJsonContent =
    result.files.find(({ path }) => path === "package.json")?.content ?? "{}";
  const packageJson = JSON.parse(packageJsonContent);

  assert.deepStrictEqual(packageJson, {
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
  assert.match(
    result.files.find(({ path }) => path === "tsconfig.json")?.content ?? "",
    /"outDir": "\.\/dist"/,
  );
});

test("applyNewU writes a package only when applyNewU is called", () => {
  const targetDirectory = mkdtempSync(join(process.cwd(), "tmp-new-u-"));

  try {
    const result = applyNewU({
      description: "A small array helper",
      name: "last-item",
      targetDirectory,
    });

    assert.strictEqual(result.status, "created");
    assert.match(
      readFileSync(join(result.packageDirectory, "src/index.ts"), "utf8"),
      /export const lastItem/,
    );
  } finally {
    rmSync(targetDirectory, { force: true, recursive: true });
  }
});

test("generateNewU rejects package names that could escape the target directory", () => {
  assert.throws(
    () =>
      generateNewU({
        description: "Invalid package",
        name: "../escape",
        targetDirectory: process.cwd(),
      }),
    NewUError,
  );
});
