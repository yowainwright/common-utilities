type Item = unknown

/**
 * @note helper functions
 * @note see `@common-utilities/filter-array`, `@common-utilities/is-object`for detail
 */
const filterArray = (arr: Item[]): Item[] =>
  arr.filter((item: Item, index: number, self: Item[]) => self.indexOf(item) === index)
const isArray = (item: Item): boolean => Array.isArray(item)
const isOfObjectType = (item: Item): boolean => item !== null && typeof item === 'object'
const isObject = (item: Item): boolean => isOfObjectType(item) && !isArray(item)

/**
 * @name mergeObjects
 * @param {item} probably an object
 * @param {otherItem} probably another object
 */
export const mergeObjects = (item: Item, otherItem: Item): Item => {
  if ((!isObject(item) && !isArray(item)) || (!isObject(otherItem) && !isArray(otherItem))) {
    return item
  }
  if (isArray(item) && isArray(otherItem)) {
    return filterArray([...(item as Array<Item>), ...(otherItem as Array<Item>)])
  }

  return filterArray([...Object.keys(item), ...Object.keys(otherItem)]).reduce(
    (acc: Record<string, unknown>, key: string) => {
      if (typeof acc[key] === 'undefined') {
        acc[key] = otherItem[key]
      } else if (isObject(acc[key]) || isArray(acc[key])) {
        acc[key] = mergeObjects(item[key], otherItem[key])
      } else if (acc[key] !== otherItem[key] && typeof otherItem[key] !== 'undefined') {
        acc[key] = otherItem[key]
      }
      return acc
    },
    item,
  )
}

export default mergeObjects
