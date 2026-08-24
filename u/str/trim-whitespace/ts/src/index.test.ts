import assert from "node:assert/strict";
import { describe, it } from "node:test";
import trimWhitespace from "./index.ts";

describe("@common-utilities/", () => {
  describe("trim-whitespace", () => {
    it("it trims whitespace", () => {
      const result = trimWhitespace(
        "    This is some  really crazy.     string.   ",
      );
      assert.strictEqual(result, "This is some really crazy. string.");
    });
  });
});
