/**
 * Filter Array 🧹
 * ----
 * a common function that removes deplicate items from an array
 * ----
 * @param {arr} an array
 * @returns an array w/o duplicates
 * @note will not work for arrays with objects
 */
export const filterArray = (arr: unknown[]): unknown[] =>
  arr.filter(
    (item: unknown, index: number, self: unknown[]) =>
      self.indexOf(item) === index,
  );

export default filterArray;
