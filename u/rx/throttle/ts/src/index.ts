type Fn<T> = (args?: T) => void;
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
  <T>(
    fn: Fn<T>,
    delay: number,
    timeoutHandler: TimeoutHandler = null,
  ): Fn<T> =>
  (args?: T): TimeoutHandler => {
    if (!timeoutHandler) {
      timeoutHandler = null;
      timeoutHandler = setTimeout(
        (): void => fn(args),
        delay,
      ) as unknown as number;
    }
    return timeoutHandler;
  };
