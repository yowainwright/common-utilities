export const filterArray = (arr: unknown[]): unknown[] =>
  arr.filter((item: unknown, index: number, self: unknown[]) => self.indexOf(item) === index)

export default filterArray
