import assert from "node:assert/strict";
import { describe, it } from "node:test";
import trace from "./index.ts";

describe("@common-utilities/", () => {
  describe("trace", () => {
    it("it traces", () => {
      const result = trace("number")(2);
      assert.strictEqual(result, 2);
    });
  });
});
