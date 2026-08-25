import assert from "node:assert/strict";
import { describe, it } from "node:test";
import snakeToCamelCase from "./index.ts";

describe("@common-utilities/snakeToCamelCase", () => {
  describe("snakeToCamelCase", () => {
    it("it converts a snake case string", () => {
      const input = "camel_case_string";
      const result = snakeToCamelCase(input);
      assert.strictEqual(result, "camelCaseString");
    });
  });
});
