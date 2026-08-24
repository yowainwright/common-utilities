import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { describe, it, mock } from "node:test";
import { getJsonData, updateMd } from "./index.ts";

describe("getJsonData", () => {
  it("returns formatted markdown text from package.json data", () => {
    const targetDirectory = mkdtempSync(
      join(process.cwd(), ".tmp-update-md-list-"),
    );

    try {
      writeFileSync(
        join(targetDirectory, "package.json"),
        JSON.stringify({
          description: "A test package",
          name: "Test Package",
        }),
      );
      const log = { debug: mock.fn(), error: mock.fn() };

      const result = getJsonData(targetDirectory, "package.json", log);

      assert.strictEqual(result, "### Test Package\n\nA test package\n\n");
    } finally {
      rmSync(targetDirectory, { force: true, recursive: true });
    }
  });
});

describe("updateMd", () => {
  it("appends markdown text to an existing file", () => {
    const targetDirectory = mkdtempSync(
      join(process.cwd(), ".tmp-update-md-list-"),
    );
    const mdPath = join(targetDirectory, "README.md");

    try {
      writeFileSync(mdPath, "");
      const log = { debug: mock.fn(), error: mock.fn() };
      const markdownText = "### Test Package\n\nA test package\n\n";

      updateMd(markdownText, mdPath, log);

      assert.strictEqual(readFileSync(mdPath, "utf8"), markdownText);
    } finally {
      rmSync(targetDirectory, { force: true, recursive: true });
    }
  });
});
