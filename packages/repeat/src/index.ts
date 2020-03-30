/**
 * repeat 🔁
 * @param i a number (count) to be iterated
 * a functional recursive `do while loop` which executes based a certain count (i)
 */
export const repeat = (i: number) => (callback) => (value): unknown =>
  i === 0 ? value : repeat(i - 1)(callback)(callback(value))
