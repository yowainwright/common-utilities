'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * pipe ⛓
 * ----
 * @param {fns} an array of functions
 * @returns the last/final value
 */
exports.pipe = (...fns) => (patchedValue) => fns.reduce((fnVal, fn) => fn(fnVal), patchedValue)
//# sourceMappingURL=index.js.map
