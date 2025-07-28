import stringInterpolation from "./index";

describe("@common-utilities/", () => {
  describe("stringInterpolation", () => {
    test("it does string interpolation", () => {
      const result = stringInterpolation("This string has #{dynamicData}", [
        { dynamicData: "a knot in it" },
      ]);
      expect(result).toEqual("This string has a knot in it");
    });

    test("it returns the original string", () => {
      const result = stringInterpolation("This string has #{dynamicData}", [
        {},
      ]);
      expect(result).toEqual("This string has #{dynamicData}");
    });
  });
});
