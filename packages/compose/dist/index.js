"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * compose 🚂
 * ----
 * a common function that take the output from one function
 * and automatically patches it to the input of the next function
 * until it spits out the final value
 * @param {fns} an array of functions
 * @returns the next/final value
 */
exports.compose = (...fns) => (patchedValue) => fns.reduceRight((fnVal, fn) => fn(fnVal), patchedValue);
//# sourceMappingURL=index.js.map