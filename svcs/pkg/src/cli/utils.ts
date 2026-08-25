import { resolve } from "node:path";
import type { CliInput } from "./types.ts";

export function parseCliInput(args: readonly string[]): CliInput | null {
  const [name, description, targetDirectory = resolve(process.cwd(), "u")] =
    args;
  const hasMissingArgument = !name || !description;

  if (hasMissingArgument) {
    return null;
  }

  return { description, name, targetDirectory };
}
