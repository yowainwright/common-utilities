import {
  existsSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import type {
  NewUInput,
  NewUResource,
} from "./types.ts";
import { namePattern } from "./constants.ts";
import {
  createDiff,
  createFiles,
  createProvenance,
  toFunctionName,
} from "./utils.ts";

export class NewUError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "NewUError";
    this.code = code;
    this.status = status;
  }
}

export function generateNewU(input: NewUInput): NewUResource {
  const { name, packageDirectory } = resolveInput(input);
  const files = createFiles(name, input.description);
  const diff = files.map(createDiff);
  const provenance = createProvenance(files);

  return {
    diff,
    files,
    function: { name: toFunctionName(name), path: "src/index.ts" },
    kind: "pkg",
    markdown: files.find(({ path }) => path === "README.md")?.content ?? "",
    name,
    packageDirectory,
    provenance,
    status: "preview",
  };
}

export function applyNewU(input: NewUInput): NewUResource {
  const preview = generateNewU(input);
  let stagingDirectory: string | undefined;

  try {
    const currentStagingDirectory = mkdtempSync(
      join(dirname(preview.packageDirectory), ".new-u-"),
    );
    stagingDirectory = currentStagingDirectory;
    mkdirSync(join(currentStagingDirectory, "src"));
    preview.files.forEach((file) => {
      writeFileSync(join(currentStagingDirectory, file.path), file.content, {
        encoding: "utf8",
        flag: "wx",
      });
    });
    renameSync(stagingDirectory, preview.packageDirectory);
  } catch (error) {
    if (stagingDirectory) {
      rmSync(stagingDirectory, { force: true, recursive: true });
    }

    if (error instanceof NewUError) {
      throw error;
    }

    throw new NewUError(
      "write-failed",
      `Could not create ${preview.packageDirectory}.`,
      500,
    );
  }

  return { ...preview, status: "created" };
}

function resolveInput(input: NewUInput) {
  validateInput(input);
  const targetDirectory = resolveTargetDirectory(input.targetDirectory);
  const packageDirectory = resolve(targetDirectory, input.name);
  const targetRelativePath = relative(targetDirectory, packageDirectory);
  const isOutsideTarget =
    targetRelativePath.startsWith("..") || isAbsolute(targetRelativePath);

  if (isOutsideTarget) {
    throw new NewUError(
      "path-escape",
      "The package path must stay inside the target directory.",
      400,
    );
  }

  if (existsSync(packageDirectory)) {
    throw new NewUError(
      "already-exists",
      `The package ${input.name} already exists.`,
      409,
    );
  }

  return { name: input.name, packageDirectory };
}

function resolveTargetDirectory(targetDirectory: string) {
  try {
    return realpathSync(targetDirectory);
  } catch {
    throw new NewUError(
      "invalid-target",
      "Target directory does not exist.",
      400,
    );
  }
}

function validateInput(input: NewUInput) {
  const hasValidName =
    typeof input.name === "string" && namePattern.test(input.name);
  const hasDescription =
    typeof input.description === "string" &&
    input.description.trim().length > 0;
  const hasAbsoluteTarget =
    typeof input.targetDirectory === "string" &&
    isAbsolute(input.targetDirectory);

  if (!hasValidName) {
    throw new NewUError(
      "invalid-name",
      "Name must use lowercase letters, numbers, and hyphens.",
      400,
    );
  }

  if (!hasDescription) {
    throw new NewUError("invalid-description", "Description is required.", 400);
  }

  if (!hasAbsoluteTarget) {
    throw new NewUError(
      "invalid-target",
      "Target directory must be an absolute path.",
      400,
    );
  }

  if (!lstatSync(input.targetDirectory).isDirectory()) {
    throw new NewUError(
      "invalid-target",
      "Target directory must be a directory.",
      400,
    );
  }
}

export { createNewUMcpServer } from "./mcp/utils.ts";
export { createNewURouter } from "./serve/utils.ts";
export { newUInputSchema, newUOutputSchema } from "./constants.ts";
export { createNewUMcpServer as createPkgMcpServer } from "./mcp/utils.ts";
export { createNewURouter as createPkgRouter } from "./serve/utils.ts";
export type {
  NewUDiff,
  NewUFile,
  NewUInput,
  NewUProvenance,
  NewUResource,
} from "./types.ts";
