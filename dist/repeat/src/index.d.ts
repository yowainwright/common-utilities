/**
 * repeat 🔁
 * @param (iterations) the number of iterations to run
 * @param (f) a callback function to be run on each iteration
 * @param (initiaValue) the intialValue
 * a functional recursive `while loop` which executes based iterations
 */
export declare const repeat: (iterations: number) => (callback: Function) => (initialValue: any) => unknown;
export default repeat;
