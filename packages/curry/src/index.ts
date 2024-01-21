import { F } from 'ts-toolbelt'

/**
 * curry
 * ----
 * DESCRIPTION
 * ----
 * @param {function}
 * @returns {array} returns a function
 */

const curry = (fn: F.Function) => function curried(...args: Parameters<typeof fn>) {
  if (args.length >= fn.length) return fn.apply(this, args)
  return (...args2: Parameters<typeof fn>) => curried.apply(this, args.concat(args2));
};

export default curry
