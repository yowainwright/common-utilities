import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import fsFns from "fs-extra";
const { copySync, readFileSync, renameSync, writeFileSync } = fsFns;
import { Options } from "./types";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function writeTextUpdates(name: string, description, dir: string) {
  const readmeFile = readFileSync(`${dir}/README.md`, "utf8");
  const readmeUpdate = readmeFile
    .replaceAll("NAME", name)
    .replaceAll("DESCRIPTION", description);
  writeFileSync(`${dir}/README.md`, readmeUpdate);
  const camelCaseName = name
    .split("-")
    .map((e, i) =>
      i
        ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
        : e.toLowerCase(),
    )
    .join("");
  const indexFile = readFileSync(`${dir}/src/index.ts`, "utf8");
  const indexFileUpdate = indexFile.replaceAll("name", camelCaseName);
  writeFileSync(`${dir}/src/index.ts`, indexFileUpdate);
  const testFile = readFileSync(`${dir}/src/index.test.ts`, "utf8");
  const testFileUpdate = testFile.replaceAll("name", camelCaseName);
  writeFileSync(`${dir}/src/index.test.ts`, testFileUpdate);
}

/**
 * auditSrcsScript
 * @param {Object} options
 * @param {string} options.name
 * @param {string} options.description
 * @returns {void}
 */
export async function createPkg({ description, name }: Options = {}) {
  if (!name) {
    console.log("`Name` is required!");
    process.exit(0);
  }

  const newDir = `packages/${name}`;

  // must match to root
  const config = resolve(__dirname, "../pkg");
  copySync(config, newDir);

  // write over initial package.json
  const pkgJSON = resolve(`${newDir}/pkg-package.json`);
  const json = await import(pkgJSON, { assert: { type: "json" } });
  const parsedJSON = JSON.parse(JSON.stringify(json));
  const updatedPakcageJSON = {
    ...parsedJSON,
    name: `@common-utilities/${name}`,
    description,
  };

  writeFileSync(
    `${newDir}/package.json`,
    JSON.stringify(updatedPakcageJSON, null, 2),
  );
  renameSync(`${newDir}/pkg-package.json`, `${newDir}/package.json`);
  writeTextUpdates(name, description, newDir);
}

export const script = createPkg;
