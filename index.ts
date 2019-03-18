/**
 * COMMON UTILITIES 🛠
 * ----
 * The following methods are used everyday in JavaScript development
 * If you're unaware that you're using them, you're using them
 */

/**
 * compose 🚂
 * ----
 * a common function that take the output from one function
 * and automatically patches it to the input of the next function
 * until it spits out the final value
 * @param {fns} an array of functions
 * @returns the next/final value
 */
export const compose = (...fns: any[]) =>
  (patchedValue: any) =>
    fns.reduceRight((fnVal: any, fn: any) => fn(fnVal), patchedValue)

/**
 * pipe ⛓
 * ----
 * @param {fns} an array of functions
 * @returns the last/final value
 */
export const pipe = (...fns: any[]) =>
  (patchedValue: any) =>
    fns.reduce((fnVal: any, fn: any) => fn(fnVal), patchedValue)

/**
 * trace
 * @param {label} string
 * @param {value} any
 */
export const trace = (label: string) => (value: any) => {
  console.log(`${label}: ${value}`)
  return value
};

/**
 * curry ➡️
 */


/**
 * head 👤
 */
export const head = ([first]: any[]) => [first]

/**
 * tail ➽
 */
const tail = ([first, ...rest]: any[]) => rest
