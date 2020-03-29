/**
 * trace
 * @param {label} string
 * @param {value} any
 */
export const trace = (label: string) => (value: any) => {
  console.log(`${label}: ${value}`)
  return value
}
