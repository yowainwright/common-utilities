"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.pipe = (...fns) => (patchedValue) => fns.reduce((fnVal, fn) => fn(fnVal), patchedValue);
exports.default = exports.pipe;
//# sourceMappingURL=index.js.map