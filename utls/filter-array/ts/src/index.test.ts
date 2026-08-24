import assert from "node:assert/strict";
import { describe, it } from "node:test";
import filterArray from "./index.ts";

describe("@common-utilities/", () => {
  describe("filter-array", () => {
    it("it removes duplicates", () => {
      const result = filterArray(["test", "test", "foo", "bar", "biz"]);
      assert.deepStrictEqual(result, ["test", "foo", "bar", "biz"]);
    });
  });
});
