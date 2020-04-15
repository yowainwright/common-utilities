/**
 * compose 🚂
 * ----
 * a common function that take the output from one function
 * and automatically patches it to the input of the next function
 * until it spits out the final value
 * @param {fns} an array of functions
 * @returns the next/final value
 */
export declare const compose: (...fns: unknown[]) => (patchedValue: unknown) => unknown;
export default compose;
