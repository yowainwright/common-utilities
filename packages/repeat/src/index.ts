/**
 * repeat 🔁
 * @param (iterations) the number of iterations to run
 * @param (f) a callback function to be run on each iteration
 * @param (initiaValue) the intialValue
 * a functional recursive `while loop` which executes based iterations
 */
export const repeat = (iterations: number) => (callback: Function) => (initialValue): unknown =>
  iterations === 0 ? initialValue : repeat(iterations - 1)(callback)(callback(initialValue))

export default repeat
