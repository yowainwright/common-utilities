"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * repeat 🔁
 * @param (iterations) the number of iterations to run
 * @param (f) a callback function to be run on each iteration
 * @param (initiaValue) the intialValue
 * a functional recursive `while loop` which executes based iterations
 */
exports.repeat = (iterations) => (callback) => (initialValue) => iterations === 0 ? initialValue : exports.repeat(iterations - 1)(callback)(callback(initialValue));
exports.default = exports.repeat;
//# sourceMappingURL=index.js.map