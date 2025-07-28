import trace from "./index";

describe("@common-utilities/", () => {
  describe("trace", () => {
    test("it traces", () => {
      const result = trace("number")(2);
      expect(result).toEqual(2);
    });
  });
});
