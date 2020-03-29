"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * trace
 * @param {label} string
 * @param {value} any
 */
exports.trace = (label) => (value) => {
    console.log(`${label}: ${value}`);
    return value;
};
//# sourceMappingURL=index.js.map