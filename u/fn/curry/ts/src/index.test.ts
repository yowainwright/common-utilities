import assert from "node:assert/strict";
import { describe, it } from "node:test";
import curry from "./index.ts";

describe("@common-utilities/curry", () => {
  describe("curry", () => {
    it("it curries a function", () => {
      const add = (num: number, num2: number, num3: number) =>
        num + num2 + num3;
      const result = curry(add)(1, 2)(3);
      assert.strictEqual(result, 6);
    });
  });
});
