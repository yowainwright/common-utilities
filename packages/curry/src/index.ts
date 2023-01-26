import { F } from 'ts-toolbelt'

/**
 * curry
 * ----
 * DESCRIPTION
 * ----
 * @param {function}
 * @returns {array} returns a function
 */

const curry = (fn: F.Function) => function curried(...args: any[]) {
  if (args.length >= fn.length) return fn.apply(this, args)
  return (...args2: any[]) => curried.apply(this, args.concat(args2));
};

export default curry
