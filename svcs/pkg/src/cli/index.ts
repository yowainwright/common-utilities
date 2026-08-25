#!/usr/bin/env node

import { applyNewU } from "../index.ts";
import { usage } from "./constants.ts";
import { parseCliInput } from "./utils.ts";

const input = parseCliInput(process.argv.slice(2));

if (!input) {
  process.stderr.write(usage);
  process.exitCode = 1;
} else {
  const resource = applyNewU(input);
  process.stdout.write(`${resource.packageDirectory}\n`);
}
