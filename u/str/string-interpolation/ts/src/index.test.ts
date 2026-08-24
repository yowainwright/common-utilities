import assert from "node:assert/strict";
import { describe, it } from "node:test";
import stringInterpolation from "./index.ts";

describe("@common-utilities/", () => {
  describe("stringInterpolation", () => {
    it("it does string interpolation", () => {
      const result = stringInterpolation("This string has #{dynamicData}", [
        { dynamicData: "a knot in it" },
      ]);
      assert.strictEqual(result, "This string has a knot in it");
    });

    it("it returns the original string", () => {
      const result = stringInterpolation("This string has #{dynamicData}", [
        {},
      ]);
      assert.strictEqual(result, "This string has #{dynamicData}");
    });
  });
});
