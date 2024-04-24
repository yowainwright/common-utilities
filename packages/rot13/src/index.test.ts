import rot13 from "./index";

describe("@common-utilities/", () => {
  describe("rot13", () => {
    test("it encryptes", () => {
      const result = rot13("Hello Rot13 is awesome!");
      expect(result).toEqual("Uryyb Ebg13 vf njrfbzr!");
    });
  });
});
