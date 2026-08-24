#!/usr/bin/env node

import { resolve } from "node:path";
import { applyNewU } from "./new-u.ts";

const [
  name,
  description,
  targetDirectory = resolve(process.cwd(), "utilities"),
] = process.argv.slice(2);

if (!name || !description) {
  process.stderr.write(
    "Usage: new-u <name> <description> [target-directory]\n",
  );
  process.exitCode = 1;
} else {
  const resource = applyNewU({ description, name, targetDirectory });
  process.stdout.write(`${resource.packageDirectory}\n`);
}
