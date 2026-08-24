export type ObjectOfStrings = {
  [key: string]: string;
};

export const kebabToCamelString = (kebabString: string): string =>
  kebabString
    .split("-")
    .map((camelString: string, i: number): string =>
      i === 0
        ? camelString
        : camelString
          ? `${camelString.charAt(0).toUpperCase()}${camelString.slice(1)}`
          : "",
    )
    .join("");

export const kebabToCamelStringsInObject = (
  kebabObjectStrings: ObjectOfStrings,
): ObjectOfStrings =>
  Object.keys(kebabObjectStrings).length
    ? Object.entries(kebabObjectStrings)
        .map(([kebabKey, value]) => [`${kebabToCamelString(kebabKey)}`, value])
        .reduce(
          (flags, [key, value]) => Object.assign(flags, { [key]: value }),
          {},
        )
    : {};

export default kebabToCamelStringsInObject;
