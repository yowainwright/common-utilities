/**
 * stringInterpolation 🧵
 * ---
 * a common utility for interpolating variables in strings
 * ---
 * @param str a string
 * @param arr an array of objects
 */

export type KeyValueStringsObject = {
  [key: string]: string
}

export const stringInterpolation = (str: string, arr: KeyValueStringsObject[]): string =>
  str && arr
    ? arr.reduce((generatedStr: string, item: KeyValueStringsObject) => {
        const dynamicKey: string = Object.keys(item).toString()
        return generatedStr.replace(`#{${dynamicKey}}`, item[dynamicKey])
      }, str)
    : str

export default stringInterpolation
