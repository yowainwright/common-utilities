/**
 * trace 🖋
 * ----
 * a common utility for tracing values
 * ----
 * @param {label} string
 * @param {value} any
 */
export const trace = (label: string) => (value: unknown): unknown => {
  console.log(`${label}: ${value}`)
  return value
}

export default trace
