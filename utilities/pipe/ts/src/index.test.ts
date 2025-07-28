import pipe from "./index";

describe("@common-utilities/", () => {
  describe("pipe", () => {
    test("it pipes from left to right", () => {
      const multiply = (val: number): number => val * 2;
      const add = (val: number): number => val + 1;
      const result = pipe(multiply, add);
      expect(result(2)).toEqual(5);
    });
  });
});
