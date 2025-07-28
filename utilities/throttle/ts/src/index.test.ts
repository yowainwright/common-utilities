import { throttle } from "./index";

describe("@common-utilities/", () => {
  describe("throttle", () => {
    it("executes just once", () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const throttledCallback = throttle(callback, 10);
      Array.from({ length: 100 }, () => throttledCallback());
      expect(callback).not.toHaveBeenCalled();
      jest.runAllTimers();
      expect(callback).toBeCalledTimes(1);
    });

    it("executes with args", () => {
      jest.useFakeTimers();
      let result = 1;
      const add1 = (val) => {
        result = val + 1;
      };
      throttle(add1, 10)(1);
      jest.runAllTimers();
      expect(result).toEqual(2);
    });
  });
});
