type Fn<T> = (args?: T) => void;

/**
 * debounce 🏓
 * ---
 * @description a basic implementation of debounce
 * @param fn a function callback
 * @param delay a number in milliseconds
 * @example debounce(fn, 100);
 */
export const debounce =
  <T>(fn: Fn<T>, delay: number, timeout = 0): Fn<T> =>
  (args?: T) => {
    clearTimeout(timeout);
    // adds `as unknown as number` to ensure setTimeout returns a number
    // like window.setTimeout
    timeout = setTimeout((): void => fn(args), delay) as unknown as number;
  };
