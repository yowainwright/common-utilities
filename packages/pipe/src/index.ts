/**
 * pipe ⛓
 * ----
 * a common function that take the output from one function
 * and automatically patches it to the input of the next function
 * until it spits out the final value in the opposite order of Compose.
 * ----
 * @param {fns} an array of functions
 * @returns the last/final value
 */
export const pipe = (...fns: unknown[]) => (patchedValue: unknown): unknown =>
  fns.reduce((fnVal: unknown, fn: (fnVal: unknown) => unknown) => fn(fnVal), patchedValue)

export default pipe
