import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import type {
  NewUDiff,
  NewUFile,
  NewUInput,
  NewUProvenance,
  NewUResource,
} from "./types.ts";

const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

  try {
    mkdirSync(preview.packageDirectory);
    mkdirSync(join(preview.packageDirectory, "src"));
    preview.files.forEach((file) => {
      writeFileSync(join(preview.packageDirectory, file.path), file.content, {
        encoding: "utf8",
        flag: "wx",
      });
    });
  } catch (error) {
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

function createFiles(name: string, description: string): NewUFile[] {
  const functionName = toFunctionName(name);
  const packageJson = {
    name: `@common-utilities/${name}`,
    version: "0.0.1",
    description,
    types: "dist/index.d.ts",
    files: ["dist"],
    private: true,
    scripts: { build: "tsc", "tsc:check": "tsc --noEmit" },
    license: "MIT",
  };
  const index = createIndex(functionName, description);
  const readme = createReadme(name, description, functionName);

  return [
    { content: readme, path: "README.md" },
    {
      content: `${JSON.stringify(packageJson, null, 2)}\n`,
      path: "package.json",
    },
    { content: createTest(functionName), path: "src/index.test.ts" },
    { content: index, path: "src/index.ts" },
    {
      content:
        '{\n  "extends": "../../tsconfig.json",\n  "include": ["src"]\n}\n',
      path: "tsconfig.json",
    },
  ].sort((left, right) => (left.path > right.path ? 1 : -1));
}

function createIndex(functionName: string, description: string) {
  return `/** ${description} */\nexport const ${functionName} = <Item>([first]: Item[]): Item | undefined => first;\n\nexport default ${functionName};\n`;
}

function createReadme(name: string, description: string, functionName: string) {
  return `# ${name}\n\n> @common-utilities/${name}\n\n${description}\n\n## Usage\n\n\`\`\`ts\nimport ${functionName} from "@common-utilities/${name}";\n\n${functionName}(["first", "second"]);\n\`\`\`\n`;
}

function createTest(functionName: string) {
  return `import assert from "node:assert/strict";\nimport { it } from "node:test";\nimport ${functionName} from "./index.ts";\n\nit("returns the first item", () => {\n  assert.strictEqual(${functionName}(["first", "second"]), "first");\n});\n`;
}

function createDiff(file: NewUFile): NewUDiff {
  const lines = file.content.trimEnd().split("\n");
  const patch = [
    `diff --git a/${file.path} b/${file.path}`,
    "new file mode 100644",
    "--- /dev/null",
    `+++ b/${file.path}`,
    ...lines.map((line) => `+${line}`),
    "",
  ].join("\n");

  return { additions: lines.length, deletions: 0, patch, path: file.path };
}

function createProvenance(files: readonly NewUFile[]): NewUProvenance {
  const digest = createHash("sha256")
    .update(JSON.stringify(files))
    .digest("hex");

  return {
    attestations: [],
    dependencies: [],
    digest: `sha256:${digest}`,
    license: "MIT",
    sourceCommit: null,
    sourceRepository: "local:common-utilities/svcs/pkg",
    tests: ["src/index.test.ts"],
  };
}

function toFunctionName(name: string) {
  return name.replace(/-([a-z0-9])/g, (_, character: string) =>
    character.toUpperCase(),
  );
}
