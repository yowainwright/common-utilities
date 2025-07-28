type Fn = (args?: unknown) => void;
type TimeoutHandler = null | number;

/**
 * throttle ⏱
 * ---
 * @param fn
 * @param delay
 * @param timeoutHandler
 * @returns {Fn}
 * @description a basic implementation of throttle
 * @example debounce(fn, 100);
 */
export const throttle =
  (fn: Fn, delay: number, timeoutHandler: TimeoutHandler = null): Fn =>
  (args?: unknown): TimeoutHandler => {
    if (!timeoutHandler) {
      timeoutHandler = setTimeout(
        (): void => fn(args),
        (timeoutHandler = null),
        delay,
      ) as unknown as number;
    }
    return timeoutHandler;
  };
