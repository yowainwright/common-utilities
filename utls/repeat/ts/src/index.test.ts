import assert from "node:assert/strict";
import { describe, it } from "node:test";
import repeat from "./index.ts";

describe("@common-utilities/", () => {
  describe("repeat", () => {
    it("it repeats", () => {
      const add1 = (x: number): number => x + 1;
      const result = repeat(100)(add1)(0);
      assert.strictEqual(result, 100);
    });
  });
});
