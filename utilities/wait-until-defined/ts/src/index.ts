/**
 * waitUntilDefined ⌚️
 * @param callbackFn
 * @param interval
 * @param timeout
 * @returns Promise<boolean>
 * @note returns promise which returns a boolean before or at a specified time
 * @note https://codepen.io/yowainwright/pen/f27a8364abb3d85e0d2e9a53020c2cae
 */

/**
 * wait
 * @param timeout
 * @returns Promise<boolean>
 * @note adds a delay of a specified time
 */
export const wait = (timeout: number): Promise<true> =>
  new Promise((resolve) => setTimeout(() => resolve(true), timeout));

/**
 * isDefined
 * @param callbackFn
 * @returns Promise<boolean>
 * @note returns a true/false based on a callback function's return value
 */
export const isDefined = (callbackFn: () => boolean): Promise<boolean> =>
  new Promise((resolve) => resolve(callbackFn()));

/**
 * checkDefinition
 * @param callbackFn
 * @param timeout
 * @param count
 * @returns Promise<boolean>
 * @note returns a promise which returns a boolean or runs the function recursively
 */
export const checkDefinition = async (
  callbackFn: () => boolean,
  timeout: number,
  count: number,
): Promise<boolean> => {
  const definition = await isDefined(callbackFn);
  if (definition) {
    return definition;
  } else {
    await wait(timeout);
    return checkDefinition(callbackFn, timeout, count - 1);
  }
};

export const waitUntilDefined = async (
  callbackFn: () => boolean,
  interval = 100,
  timeout = 5000,
): Promise<boolean> => {
  const count = timeout / interval;
  const definition = await checkDefinition(callbackFn, interval, count);
  return definition;
};
