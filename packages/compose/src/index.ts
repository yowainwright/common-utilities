/**
 * compose 🚂
 * ----
 * a common function that takes the output from one function
 * and automatically patches it to the input of the next function from right to left
 * until it spits out the final value
 * ----
 * @param {fns} an array of functions
 * @returns the next/final value
 */
export const compose =
  (...fns: unknown[]) =>
  (patchedValue: unknown): unknown =>
    fns.reduceRight(
      (fnVal: unknown, fn: (fnVal: unknown) => unknown) => fn(fnVal),
      patchedValue,
    );

export default compose;
