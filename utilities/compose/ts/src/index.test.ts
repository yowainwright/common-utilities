import compose from "./index";

describe("@common-utilities/", () => {
  describe("compose", () => {
    test("it composes from right to left", () => {
      const add = (val: number): number => val + 1;
      const multiply = (val: number): number => val * 2;
      const result = compose(add, multiply);
      expect(result(2)).toEqual(5);
    });
  });
});
