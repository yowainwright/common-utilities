/** @deprecated Prefer waiting for the event that makes a value available. */
export const wait = (timeout: number): Promise<true> =>
  new Promise((resolve) => setTimeout(() => resolve(true), timeout));

/** @deprecated Prefer checking the value at its source. */
export const isDefined = (callbackFn: () => boolean): Promise<boolean> =>
  Promise.resolve(callbackFn());

/** @deprecated Prefer an event-driven readiness signal. */
export const checkDefinition = async (
  callbackFn: () => boolean,
  interval: number,
  attempts: number,
): Promise<boolean> => {
  if (attempts <= 0) {
    return false;
  }

  const definition = await isDefined(callbackFn);
  if (definition) {
    return true;
  }

  if (attempts === 1) {
    return false;
  }

  await wait(interval);
  return checkDefinition(callbackFn, interval, attempts - 1);
};

/** @deprecated Prefer an event-driven readiness signal. */
export const waitUntilDefined = async (
  callbackFn: () => boolean,
  interval = 100,
  timeout = 5000,
): Promise<boolean> => {
  const isValidInterval = Number.isFinite(interval) && interval > 0;
  const isValidTimeout = Number.isFinite(timeout) && timeout >= 0;

  if (!isValidInterval || !isValidTimeout) {
    throw new RangeError("interval must be > 0 and timeout must be >= 0");
  }

  const attempts = Math.floor(timeout / interval) + 1;
  const definition = await checkDefinition(callbackFn, interval, attempts);
  return definition;
};
