type Item = any

/**
 * @name deepConfluence
 * @param {item}
 * @param {otherItem} obj(s)
 */
export const mergeObjects = (item: Item, otherItem: Item) => {
  if ((!isObject(item) && !isArray(item)) || (!isObject(otherItem) && !isArray(otherItem))) return item

  if (isArray(item) && isArray(otherItem)) return filterArray([...item, ...otherItem])

  return filterArray([...Object.keys(item), ...Object.keys(otherItem)]).reduce((acc: any, key: any) => {
    if (typeof acc[key] === 'undefined') {
      acc[key] = otherItem[key]
    } else if (isObject(acc[key]) || isArray(acc[key])) {
      acc[key] = deepConfluence(item[key], otherItem[key])
    } else if (acc[key] !== otherItem[key] && typeof otherItem[key] !== 'undefined') {
      acc[key] = otherItem[key]
    }
    return acc
  }, item)
}
