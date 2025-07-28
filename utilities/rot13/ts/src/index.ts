export const input = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const output = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";

export const rot13 = (str: string): string => {
  return str
    .split("")
    .map((char: string): string =>
      input.indexOf(char) > -1 ? output[input.indexOf(char)] : char,
    )
    .join("");
};

export default rot13;
