import { kebabToCamelString, kebabToCamelStringsInObject } from "./index";

describe("@common-utilities/", () => {
  describe("kebab-to-camel-string", () => {
    test("string", () => {
      const result = kebabToCamelString("test-thing");
      expect(result).toEqual("testThing");
    });

    test("object", () => {
      const result = kebabToCamelStringsInObject({ "test-thing": "foo" });
      expect(result).toEqual({ testThing: "foo" });
    });
  });
});
