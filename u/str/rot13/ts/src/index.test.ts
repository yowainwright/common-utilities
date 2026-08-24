import assert from "node:assert/strict";
import { describe, it } from "node:test";
import rot13 from "./index.ts";

describe("@common-utilities/", () => {
  describe("rot13", () => {
    it("it encrypts", () => {
      const result = rot13("Hello Rot13 is awesome!");
      assert.strictEqual(result, "Uryyb Ebg13 vf njrfbzr!");
    });
  });
});
