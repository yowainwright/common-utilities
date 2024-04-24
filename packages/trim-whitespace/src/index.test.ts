import trimWhitespace from "./index";

describe("@common-utilities/", () => {
  describe("trim-whitespace", () => {
    test("it trims whitespace", () => {
      const result = trimWhitespace(
        "    This is some  really crazy.     string.   ",
      );
      expect(result).toEqual("This is some really crazy. string.");
    });
  });
});
