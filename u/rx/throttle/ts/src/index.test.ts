import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { throttle } from "./index.ts";

describe("@common-utilities/", () => {
  describe("throttle", () => {
    it("executes just once", () => {
      mock.timers.enable({ apis: ["setTimeout"] });
      try {
        const callback = mock.fn();
        const throttledCallback = throttle(callback, 10);
        Array.from({ length: 100 }, () => throttledCallback());
        assert.strictEqual(callback.mock.callCount(), 0);
        mock.timers.runAll();
        assert.strictEqual(callback.mock.callCount(), 1);
      } finally {
        mock.timers.reset();
      }
    });

    it("executes with args", () => {
      mock.timers.enable({ apis: ["setTimeout"] });
      try {
        let result = 1;
        const add1 = (val = 0) => {
          result = val + 1;
        };
        throttle(add1, 10)(1);
        mock.timers.runAll();
        assert.strictEqual(result, 2);
      } finally {
        mock.timers.reset();
      }
    });
  });
});
