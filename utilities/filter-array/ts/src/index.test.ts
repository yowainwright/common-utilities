import filterArray from "./index";

describe("@common-utilities/", () => {
  describe("filter-array", () => {
    test("it removes duplicates", () => {
      const result = filterArray(["test", "test", "foo", "bar", "biz"]);
      expect(result).toEqual(["test", "foo", "bar", "biz"]);
    });
  });
});
