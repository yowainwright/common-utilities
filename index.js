"use strict";
/**
 * COMMON UTILITIES 🛠
 * ----
 * The following methods are used everyday in JavaScript development
 * If you're unaware that you're using them, you're using them
 */
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
 * pipe ⛓
 * ----
 * @param {fns} an array of functions
 * @returns the last/final value
 */
exports.pipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (patchedValue) {
        return fns.reduce(function (fnVal, fn) { return fn(fnVal); }, patchedValue);
    };
};
/**
 * trace
 * @param {label} string
 * @param {value} any
 */
exports.trace = function (label) { return function (value) {
    console.log(label + ": " + value);
    return value;
}; };
/**
 * curry ➡️
 * @TODO
 */
/**
 * head 👤
 * @param {array}
 * @returns {item} returns the first item of an array
 */
exports.head = function (_a) {
    var first = _a[0];
    return [first];
};
/**
 * tail ➽
 * @param {array}
 * @returns {items} returns the rest of the items besides the first item in an array
 */
var tail = function (_a) {
    var first = _a[0], rest = _a.slice(1);
    return rest;
};
