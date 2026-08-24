import assert from "node:assert/strict";
import { describe, it } from "node:test";
import pipe from "./index.ts";

describe("@common-utilities/", () => {
  describe("pipe", () => {
    it("it pipes from left to right", () => {
      const multiply = (val: number): number => val * 2;
      const add = (val: number): number => val + 1;
      const result = pipe(multiply, add);
      assert.strictEqual(result(2), 5);
    });
  });
});
