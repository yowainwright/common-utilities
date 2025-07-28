#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import { script } from "./script";
import { Input, InputOptions, Options } from "./types";
const version = "VERSION";

export async function getInput({
  name,
  message,
}: InputOptions): Promise<string> {
  const { name: input = "" }: Input = await inquirer.prompt({
    type: "input",
    name,
    message,
  });
  return input ? input : "";
}

/**
 * action
 * @param {pkgType} string
 * @param {Options} options
 */
async function action(options: Options = {}) {
  try {
    // resolves "name"
    const name = options?.name
      ? options.name
      : await getInput({
          name: "name",
          message: "What is the name of the package?",
        });

    // resolves "description"
    const description = options?.description
      ? options.description
      : await getInput({
          name: "description",
          message: "What is the description of the package?",
        });
    await script({ description, name });
  } catch (err) {
    console.error(err);
  }
}

program
  .version(version)
  .description("creates a new package based on pckType")
  .option("-d, --description <description>", "description of the package")
  .option("-n, --name <name>", "name of the package")
  .action(action)
  .parse(process.argv);

export default program;
