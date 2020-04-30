"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * trace 🖋
 * ----
 * a common utility for tracing values
 * ----
 * @param {label} string
 * @param {value} any
 */
exports.trace = (label) => (value) => {
    console.log(`${label}: ${value}`);
    return value;
};
exports.default = exports.trace;
//# sourceMappingURL=index.js.map