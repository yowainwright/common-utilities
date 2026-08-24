import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { wait, isDefined, checkDefinition, waitUntilDefined } from "./index.ts";

describe("@common-utilities/", () => {
  describe("wait-until-defined", () => {
    it("wait", async () => {
      let test;
      setTimeout(() => {
        test = 2;
      }, 10);
      const result = await wait(30);
      assert.strictEqual(result, true);
      assert.strictEqual(test, 2);
    });

    it("isDefined", async () => {
      const thing = "yay";
      const testVar = () => thing === "yay";
      const result = await isDefined(testVar);
      assert.strictEqual(result, true);
    });
  });

  it("checkDefinition", async () => {
    const thing = "yay";
    const testVar = () => thing === "yay";
    const result = await checkDefinition(testVar, 10, 1);
    assert.strictEqual(result, true);
  });

  it("returns false when attempts are exhausted", async () => {
    const result = await waitUntilDefined(() => false, 1, 1);
    assert.strictEqual(result, false);
  });

  it("waitUntilDefined", async () => {
    const thing = "yay";
    const testVar = () => thing === "yay";
    const result = await waitUntilDefined(testVar, 10, 1);
    assert.strictEqual(result, true);
  });
});
