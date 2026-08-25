import assert from "node:assert/strict";
import { resolve } from "node:path";
import { it } from "node:test";
import { parseCliInput } from "./utils.ts";

it("defaults packages to the root u directory", () => {
  const input = parseCliInput(["first-item", "A small array helper"]);

  assert.strictEqual(input?.targetDirectory, resolve(process.cwd(), "u"));
});
