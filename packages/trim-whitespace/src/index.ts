export const removeWhitespaceFromString = (string: string): string =>
  string
    .trim()
    .split("  ")
    .map((word: string): string => word.trim())
    .filter((word: string): boolean => word !== "")
    .join(" ");

export default removeWhitespaceFromString;
