import snakeToCamelCase from "./index";

describe("@common-utilities/snakeToCamelCase", () => {
  describe("snakeToCamelCase", () => {
    test("it returns a snake case string", () => {
      const input = "camel_case_string";
      const result = snakeToCamelCase(input);
      expect(result).toEqual("camelCaseString");
    });
  });
});
