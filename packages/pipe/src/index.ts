/**
 * pipe ⛓
 * ----
 * @param {fns} an array of functions
 * @returns the last/final value
 */
export const pipe = (...fns: any[]) => (patchedValue: any) =>
  fns.reduce((fnVal: any, fn: any) => fn(fnVal), patchedValue)
