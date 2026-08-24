import assert from "node:assert/strict";
import { describe, it } from "node:test";
import head from "./index.ts";

describe("@common-utilities/", () => {
  describe("head", () => {
    it("it returns the first item (the head) of an array", () => {
      const input = Array.from(Array(10).keys());
      const result = head(input);
      assert.strictEqual(result, 0);
    });
  });
});
