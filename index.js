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
exports.compose = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (patchedValue) {
        return fns.reduceRight(function (fnVal, fn) { return fn(fnVal); }, patchedValue);
    };
};
/**
 * pipe
 * ----
 *
 */
