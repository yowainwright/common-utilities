import { createHash } from "node:crypto";
import type { NewUDiff, NewUFile, NewUProvenance } from "./types.ts";

export function createFiles(name: string, description: string): NewUFile[] {
  const functionName = toFunctionName(name);
  const packageEntry = "./dist/index.js";
  const packageTypes = "./dist/index.d.ts";
  const packageExports = {
    ".": {
      types: packageTypes,
      default: packageEntry,
    },
  };
  const scripts = {
    build: "tsc",
    "tsc:check": "tsc --noEmit",
  };
  const packageJson = {
    name: `@common-utilities/${name}`,
    version: "0.0.1",
    description,
    type: "module",
    exports: packageExports,
    main: packageEntry,
    module: packageEntry,
    private: true,
    scripts,
    types: packageTypes,
    license: "MIT",
  };
  const tsconfig = {
    compilerOptions: {
      declaration: true,
      module: "nodenext",
      moduleResolution: "nodenext",
      outDir: "./dist",
      rootDir: "./src",
      target: "esnext",
    },
    exclude: ["src/**/*.test.ts"],
    include: ["src"],
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
      content: `${JSON.stringify(tsconfig, null, 2)}\n`,
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
  return `import assert from "node:assert/strict";\nimport { test } from "node:test";\nimport ${functionName} from "./index.ts";\n\ntest("${functionName} returns the first item", () => {\n  assert.strictEqual(${functionName}(["first", "second"]), "first");\n});\n`;
}

export function createDiff(file: NewUFile): NewUDiff {
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

export function createProvenance(
  files: readonly NewUFile[],
): NewUProvenance {
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

export function toFunctionName(name: string) {
  return name.replace(/-([a-z0-9])/g, (_, character: string) =>
    character.toUpperCase(),
  );
}
