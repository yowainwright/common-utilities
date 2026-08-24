/**
 * pipe ⛓
 * ----
 * a common function that take the output from one function
 * and automatically patches it to the input of the next function from left to right
 * until it spits out the final value in the opposite order of Compose.
 * ----
 * @param {fns} an array of functions
 * @returns the last/final value
 */
export const pipe =
  <T>(...fns: Array<(value: T) => T>) =>
  (patchedValue: T): T =>
    fns.reduce(
      (fnVal: T, fn: (fnVal: T) => T) => fn(fnVal),
      patchedValue,
    );

export default pipe;
