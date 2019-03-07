/**
 * compose 🚂
 * ----
 * a common function that take the output from one function
 * and automatically patches it to the input of the next function
 * until it spits out the final value
 * @param {fns} an array of functions
 * @returns the next/final value
 */
export const compose = (...fns: Array<Function>) =>
  (patchedValue: any) =>
    fns.reduceRight((fnVal: any, fn: Function) => fn(fnVal), patchedValue)

/**
 * pipe
 * ----
 *
 */
