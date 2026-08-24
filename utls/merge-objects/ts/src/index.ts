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
  if (
    (!isObject(item) && !isArray(item)) ||
    (!isObject(otherItem) && !isArray(otherItem))
  ) {
    return item;
  }
  if (isArray(item) && isArray(otherItem)) {
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
      if (typeof acc[key] === "undefined") {
        acc[key] = otherItemObject[key];
      } else if (isObject(acc[key]) || isArray(acc[key])) {
        acc[key] =
          !isPrototypePolluted(key) &&
          mergeObjects(itemObject[key], otherItemObject[key]);
      } else if (
        acc[key] !== otherItemObject[key] &&
        typeof otherItemObject[key] !== "undefined"
      ) {
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
