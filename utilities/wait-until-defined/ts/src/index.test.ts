import { wait, isDefined, checkDefinition, waitUntilDefined } from "./index";

describe("@common-utilities/", () => {
  describe("wait-until-defined", () => {
    it("wait", async () => {
      let test;
      setTimeout(() => {
        test = 2;
      }, 10);
      const result = await wait(30);
      expect(result).toBe(true);
      expect(test).toEqual(2);
    });

    it("isDefined", async () => {
      const thing = "yay";
      const testVar = () => thing === "yay";
      const result = await isDefined(testVar);
      expect(result).toEqual(true);
    });
  });

  it("checkDefinition", async () => {
    const thing = "yay";
    const testVar = () => thing === "yay";
    const result = await checkDefinition(testVar, 10, 1);
    expect(result).toEqual(true);
  });

  it("waitUntilDefined", async () => {
    const thing = "yay";
    const testVar = () => thing === "yay";
    const result = await waitUntilDefined(testVar, 10, 1);
    expect(result).toEqual(true);
  });
});
