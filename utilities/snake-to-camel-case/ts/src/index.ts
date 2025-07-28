/**
 * snakeToCamelCase 🐍 🐫
 * ----
 * a utility to convert snake_case to camelCase 🐍🐫
 * ----
 * @param {string} takes in a snake_case string
 * @returns {string} returns a camelCase string
 */
export const snakeToCamelCase = (str: string): string =>
  str
    .split("_")
    .map((word: string, index: number) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1),
    )
    .join("");

export default snakeToCamelCase;
