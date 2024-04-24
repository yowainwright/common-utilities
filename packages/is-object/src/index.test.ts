import { isObject, isOfObjectType, isArray } from "./index";

describe("@common-utilities/", () => {
  describe("is-object", () => {
    describe("isOfObjectType", () => {
      test("array", () => {
        const result = isOfObjectType(["test", "test"]);
        expect(result).toEqual(true);
      });
      test("object", () => {
        const result = isOfObjectType({ foo: "test" });
        expect(result).toEqual(true);
      });
      test("number", () => {
        const result = isOfObjectType(9);
        expect(result).toEqual(false);
      });
      test("string", () => {
        const result = isOfObjectType("string");
        expect(result).toEqual(false);
      });
      test("null", () => {
        const result = isOfObjectType(null);
        expect(result).toEqual(false);
      });
      test("undefined", () => {
        const result = isOfObjectType(undefined);
        expect(result).toEqual(false);
      });
    });

    describe("isObject", () => {
      test("false", () => {
        const result = isObject(["test", "test"]);
        expect(result).toEqual(false);
      });
      test("true", () => {
        const result = isObject({ foo: "test" });
        expect(result).toEqual(true);
      });
    });

    describe("isArray", () => {
      test("true", () => {
        const result = isArray(["test", "test"]);
        expect(result).toEqual(true);
      });
      test("false", () => {
        const result = isArray({ foo: "test" });
        expect(result).toEqual(false);
      });
    });
  });
});
