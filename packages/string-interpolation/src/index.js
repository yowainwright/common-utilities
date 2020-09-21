'use strict'
/**
 * stringInterpolation 🧵
 * ---
 * a common utility for interpolating variables in strings
 * ---
 * @param str a string
 * @param arr an array of objects
 */
exports.__esModule = true
exports.stringInterpolation = void 0
exports.stringInterpolation = function (str, arr) {
  return str && arr
    ? arr.reduce(function (generatedStr, item) {
        const dynamicKey = Object.keys(item).toString()
        return generatedStr.replace('#{' + dynamicKey + '}', item[dynamicKey])
      }, str)
    : str
}
exports['default'] = exports.stringInterpolation
