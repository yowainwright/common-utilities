import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isObject, isOfObjectType, isArray } from "./index.ts";

describe("@common-utilities/", () => {
  describe("is-object", () => {
    describe("isOfObjectType", () => {
      it("array", () => {
        const result = isOfObjectType(["test", "test"]);
        assert.strictEqual(result, true);
      });
      it("object", () => {
        const result = isOfObjectType({ foo: "test" });
        assert.strictEqual(result, true);
      });
      it("number", () => {
        const result = isOfObjectType(9);
        assert.strictEqual(result, false);
      });
      it("string", () => {
        const result = isOfObjectType("string");
        assert.strictEqual(result, false);
      });
      it("null", () => {
        const result = isOfObjectType(null);
        assert.strictEqual(result, false);
      });
      it("undefined", () => {
        const result = isOfObjectType(undefined);
        assert.strictEqual(result, false);
      });
    });

    describe("isObject", () => {
      it("false", () => {
        const result = isObject(["test", "test"]);
        assert.strictEqual(result, false);
      });
      it("true", () => {
        const result = isObject({ foo: "test" });
        assert.strictEqual(result, true);
      });
    });

    describe("isArray", () => {
      it("true", () => {
        const result = isArray(["test", "test"]);
        assert.strictEqual(result, true);
      });
      it("false", () => {
        const result = isArray({ foo: "test" });
        assert.strictEqual(result, false);
      });
    });
  });
});
