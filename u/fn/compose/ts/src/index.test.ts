import assert from "node:assert/strict";
import { describe, it } from "node:test";
import compose from "./index.ts";

describe("@common-utilities/", () => {
  describe("compose", () => {
    it("it composes from right to left", () => {
      const add = (val: number): number => val + 1;
      const multiply = (val: number): number => val * 2;
      const result = compose(add, multiply);
      assert.strictEqual(result(2), 5);
    });
  });
});
