import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { kebabToCamelString, kebabToCamelStringsInObject } from "./index.ts";

describe("@common-utilities/", () => {
  describe("kebab-to-camel-string", () => {
    it("string", () => {
      const result = kebabToCamelString("test-thing");
      assert.strictEqual(result, "testThing");
    });

    it("object", () => {
      const result = kebabToCamelStringsInObject({ "test-thing": "foo" });
      assert.deepStrictEqual(result, { testThing: "foo" });
    });
  });
});
