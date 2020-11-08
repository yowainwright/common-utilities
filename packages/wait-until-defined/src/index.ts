/**
 * waitUntilDefined ⌚️
 * @param value
 * @param intervals
 * @param timeout
 * @note return a value, or undefined after a specified time
 */

type Counter = {
  total: number
  upOne: () => number
}

/**
 * counter
 * @note count a total which can be added by 1
 */
const counter = (): Counter => ({
  total: 0,
  upOne(): number {
    return this.total + 1
  },
})

type SetDefinition = {
  value: undefined | unknown
  update: (value: unknown) => unknown
}

/**
 * setDefinition
 * @param value
 * @note sets the definition of a value and updates that value
 */
const setDefinition = (value = undefined): SetDefinition => ({
  value,
  update(value: unknown): unknown {
    return (this.value = value)
  },
})

export const waitUntilDefined = (value: unknown, intervals: number, timeout: number): unknown => {
  const count = counter()
  const iterations = Math.round(timeout / intervals)
  const definition = setDefinition(value)
  if (definition.value) {
    return definition.value
  }
  const check = setInterval(() => {
    count.upOne()
    if (count.total >= iterations) {
      clearInterval(check)
    } else if (definition?.value) {
      clearInterval(check)
    }
  }, intervals)
  return definition.value
}
