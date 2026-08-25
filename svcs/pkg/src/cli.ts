#!/usr/bin/env node

import { resolve } from "node:path";
import { applyNewU } from "./new-u.ts";

const [name, description, targetDirectory = resolve(process.cwd(), "u")] =
  process.argv.slice(2);
const hasMissingArgument = !name || !description;

if (hasMissingArgument) {
  process.stderr.write("Usage: pkg <name> <description> [target-directory]\n");
  process.exitCode = 1;
} else {
  const resource = applyNewU({ description, name, targetDirectory });
  process.stdout.write(`${resource.packageDirectory}\n`);
}
