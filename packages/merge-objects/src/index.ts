import filterArray from '../../fllter-array/src'
import { isArray, isObject } from '../../is-object/src'

type Item = unknown

/**
 * @name mergeObjects
 * @param {item}
 * @param {otherItem}
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
