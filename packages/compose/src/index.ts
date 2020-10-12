/**
 * compose 🚂
 * ----
 * a common function that takes the output from one function
 * and automatically patches it to the input of the next function
 * until it spits out the final value
 * ----
 * @param {fns} an array of functions
 * @returns the next/final value
 */
export const compose = (...fns: unknown[]) => (patchedValue: unknown): unknown =>
  fns.reduceRight((fnVal: unknown, fn: Function) => fn(fnVal), patchedValue)

export default compose
