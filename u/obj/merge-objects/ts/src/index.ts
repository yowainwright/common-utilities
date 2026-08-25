type Item = unknown;

/**
 * @note helper functions
 * @note see `@common-utilities/filter-array`, `@common-utilities/is-object`for detail
 */
const filterArray = (arr: Item[]): Item[] =>
  arr.filter(
    (item: Item, index: number, self: Item[]) => self.indexOf(item) === index,
  );
const isArray = (item: Item): item is Item[] => Array.isArray(item);
const isOfObjectType = (item: Item): item is object =>
  item !== null && typeof item === "object";
const isObject = (item: Item): item is Record<string, unknown> =>
  isOfObjectType(item) && !isArray(item);

/**
 * @name mergeObjects
 * @param {item} probably an object
 * @param {otherItem} probably another object
 */
export const mergeObjects = (item: Item, otherItem: Item): Item => {
  const isMergeableItem = isObject(item) || isArray(item);
  const isMergeableOtherItem = isObject(otherItem) || isArray(otherItem);
  const hasUnmergeableItem = !isMergeableItem || !isMergeableOtherItem;

  if (hasUnmergeableItem) {
    return item;
  }

  const areBothArrays = isArray(item) && isArray(otherItem);
  if (areBothArrays) {
    return filterArray([
      ...(item as Array<Item>),
      ...(otherItem as Array<Item>),
    ]);
  }

  const itemObject = item as Record<string, unknown>;
  const otherItemObject = otherItem as Record<string, unknown>;
  const keys = filterArray([
    ...Object.keys(itemObject),
    ...Object.keys(otherItemObject),
  ]).filter((key): key is string => typeof key === "string");

  return keys.reduce(
    (acc: Record<string, unknown>, key: string) => {
      const currentValue = acc[key];
      const isMissingValue = typeof currentValue === "undefined";

      if (isMissingValue) {
        acc[key] = otherItemObject[key];
        return acc;
      }

      const isMergeableValue = isObject(currentValue) || isArray(currentValue);
      if (isMergeableValue) {
        const isSafeKey = !isPrototypePolluted(key);
        let mergedValue: Item = false;
        if (isSafeKey) {
          mergedValue = mergeObjects(itemObject[key], otherItemObject[key]);
        }
        acc[key] = mergedValue;
        return acc;
      }

      const hasDifferentValue = acc[key] !== otherItemObject[key];
      const hasDefinedOtherValue = typeof otherItemObject[key] !== "undefined";
      const shouldUseOtherValue = hasDifferentValue && hasDefinedOtherValue;
      if (shouldUseOtherValue) {
        acc[key] = otherItemObject[key];
      }

      return acc;
    },
    itemObject,
  );
};

/**
 * @name isPrototypePolluted
 * @param {key} probably a string
 */
const isPrototypePolluted = (key: string) =>
  ["__proto__", "constructor", "prototype"].includes(key);

export default mergeObjects;
