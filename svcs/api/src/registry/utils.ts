import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { ColdObservable } from "rxjs";
import { map } from "rxjs/map";
import { reduce } from "rxjs/reduce";
import type {
  PackageFilters,
  PackagePattern,
  PackageRecord,
  UtilityCodeBlock,
  UtilityRecord,
} from "./types.ts";

export function resolveUtilities(query: string) {
  return resolvePackages(query, { kind: "util" });
}

export function resolvePackages(query: string, filters: PackageFilters = {}) {
  const normalizedQuery = query.toLowerCase();
  const registry = readPackageRegistry();
  const filtered = registry.filter((record) => isPackageMatch(record, filters));
  const resolutions = filtered.map((record) => {
    const score = scorePackage(record, normalizedQuery);

    return { ...toPackageSummary(record), score };
  });
  const matched = resolutions.filter(({ score }) => score > 0 || !query);

  return matched.toSorted((left, right) => right.score - left.score);
}

export function findUtility(category: string, slug: string) {
  return readUtilityRegistry().find((utility) => {
    const hasCategory = utility.category === category;
    const hasSlug = utility.slug === slug;
    const isMatch = hasCategory && hasSlug;

    return isMatch;
  });
}

export function findPackage(kind: string, group: string, slug: string) {
  const record = readPackageRegistry().find((item) => {
    const hasKind = item.kind === kind;
    const hasGroup = item.group === group;
    const hasSlug = item.slug === slug;
    const isMatch = hasKind && hasGroup && hasSlug;

    return isMatch;
  });

  if (record) {
    return record;
  }

  return null;
}

export function readUtilityTags(utility: UtilityRecord) {
  return readPackageTags(utility);
}

export function readPackageTags(record: PackageRecord) {
  const values = [record.kind, record.group, record.slug, ...record.keywords];

  return Array.from(new Set(values)).sort();
}

export function createUtilityPatterns(utility: UtilityRecord) {
  return createPackagePatterns(utility);
}

export function createPackagePatterns(record: PackageRecord) {
  const tags = readPackageTags(record);
  const tagStream = createTagStream(tags);
  const patternStream = tagStream[map](toRegistryPattern)[reduce]<
    PackagePattern[]
  >(
    (patterns, pattern) => [...patterns, pattern],
    [],
  );

  return readObservableValue(patternStream);
}

export function toUtilityDetail(utility: UtilityRecord) {
  return toPackageDetail(utility);
}

export function toPackageDetail(record: PackageRecord) {
  return {
    ...toPackageSummary(record),
    codeBlocks: record.codeBlocks.map(toCodeBlockSummary),
    dependencies: record.dependencies,
    devDependencies: record.devDependencies,
    directory: record.directory,
    paths: {
      readme: record.readmePath,
      source: record.sourcePath,
      tests: record.testPath,
    },
    version: record.version,
  };
}

export function toUtilityUsage(utility: UtilityRecord, type: string) {
  return toPackageUsage(utility, type);
}

export function toPackageUsage(record: PackageRecord, type: string) {
  if (type === "all") {
    return {
      codeBlocks: record.codeBlocks.map(toCodeBlockSummary),
      install: toPackageInstall(record, "copy"),
      kind: "all",
      setup: toPackageSetup(record, "source"),
      tests: toPackageTests(record),
    };
  }

  const isCodeBlockUsage = type === "codeblocks" || type === "code-blocks";

  if (isCodeBlockUsage) {
    return { codeBlocks: record.codeBlocks, kind: "codeblocks" };
  }

  if (type === "how-to-use") {
    return { code: record.tests, kind: "how-to-use", path: record.testPath };
  }

  if (type === "readme") {
    return toPackageReadme(record);
  }

  if (type === "tests") {
    return toPackageTests(record);
  }

  return null;
}

export function toUtilityInstall(
  utility: UtilityRecord,
  packageManager: string,
) {
  return toPackageInstall(utility, packageManager);
}

export function toPackageInstall(
  record: PackageRecord,
  packageManager: string,
) {
  const packageManagers = new Set(["bun", "copy", "npm", "pnpm", "yarn"]);

  if (!packageManagers.has(packageManager)) {
    return null;
  }

  const dependencyFree = record.dependencies.length === 0;

  return {
    command: readInstallCommand(record, packageManager),
    dependencies: record.dependencies,
    dependencyFree,
    packageManager,
  };
}

export function toUtilitySetup(utility: UtilityRecord, type: string) {
  return toPackageSetup(utility, type);
}

export function toPackageSetup(record: PackageRecord, type: string) {
  if (type === "source") {
    return {
      files: [record.sourcePath],
      kind: "source",
      target: `src/${record.slug}.ts`,
    };
  }

  if (type === "tests") {
    return { files: [record.testPath], kind: "tests" };
  }

  if (type === "readme") {
    return { files: [record.readmePath], kind: "readme" };
  }

  if (type === "all") {
    return {
      files: [record.sourcePath, record.testPath, record.readmePath],
      kind: "all",
    };
  }

  return null;
}

export function toUtilityTests(utility: UtilityRecord) {
  return toPackageTests(utility);
}

export function toPackageTests(record: PackageRecord) {
  return { code: record.tests, kind: "tests", path: record.testPath };
}

export function toUtilityReadme(utility: UtilityRecord) {
  return toPackageReadme(utility);
}

export function toPackageReadme(record: PackageRecord) {
  return { kind: "readme", markdown: record.readme, path: record.readmePath };
}

export function findCodeBlock(record: PackageRecord, id: string) {
  const numericId = Number(id);
  const isNumericId = Number.isInteger(numericId) && String(numericId) === id;

  if (isNumericId) {
    return record.codeBlocks.find((codeBlock) => codeBlock.id === numericId);
  }

  return record.codeBlocks.find((codeBlock) => codeBlock.key === id);
}

function scorePackage(record: PackageRecord, query: string) {
  if (!query) {
    return 1;
  }

  const tags = readPackageTags(record);
  const haystack = [
    record.description,
    record.group,
    record.kind,
    record.name,
    record.slug,
    ...tags,
  ].join(" ").toLowerCase();

  if (!haystack.includes(query)) {
    return 0;
  }

  if (record.slug === query) {
    return 1;
  }

  if (tags.includes(query)) {
    return 0.75;
  }

  return 0.5;
}

function isPackageMatch(record: PackageRecord, filters: PackageFilters) {
  const hasKindFilter = Boolean(filters.kind);
  const hasKindMismatch = hasKindFilter && record.kind !== filters.kind;

  if (hasKindMismatch) {
    return false;
  }

  const hasGroupFilter = Boolean(filters.group);
  const hasGroupMismatch = hasGroupFilter && record.group !== filters.group;

  if (hasGroupMismatch) {
    return false;
  }

  return true;
}

function readPackageRegistry() {
  return [...readUtilityRegistry(), ...readServiceRegistry()];
}

function readUtilityRegistry() {
  const root = readUtilitiesRoot();
  const categoryNames = readDirectoryNames(root);

  return categoryNames
    .map((category) => readCategoryUtilities(root, category))
    .flat();
}

function readCategoryUtilities(root: string, category: string) {
  const categoryDirectory = join(root, category);
  const utilityNames = readDirectoryNames(categoryDirectory);

  return utilityNames.flatMap((slug) => readUtility(root, category, slug));
}

function readUtilitiesRoot() {
  const workspaceRoot = readWorkspaceRoot(process.cwd());

  return join(workspaceRoot, "u");
}

function readServicesRoot() {
  const workspaceRoot = readWorkspaceRoot(process.cwd());

  return join(workspaceRoot, "svcs");
}

function readWorkspaceRoot(directory: string): string {
  if (existsSync(join(directory, "u"))) {
    return directory;
  }

  const parent = dirname(directory);
  const isRootDirectory = parent === directory;

  if (isRootDirectory) {
    return directory;
  }

  return readWorkspaceRoot(parent);
}

function readServiceRegistry() {
  const root = readServicesRoot();
  const serviceNames = readDirectoryNames(root);

  return serviceNames.flatMap((slug) => readService(root, slug));
}

function readService(root: string, slug: string) {
  const directory = join(root, slug);
  const packagePath = join(directory, "package.json");

  if (!existsSync(packagePath)) {
    return [];
  }

  return [readServiceRecord(root, directory, slug)];
}

function readServiceRecord(
  root: string,
  directory: string,
  slug: string,
): PackageRecord {
  const workspaceRoot = dirname(root);
  const packageJson = readJsonRecord(join(directory, "package.json"));
  const readmePath = join(directory, "README.md");
  const sourcePath = join(directory, "src", "index.ts");
  const testPath = join(directory, "tests", "unit", "index.test.ts");
  const readme = readOptionalFile(readmePath);
  const source = readOptionalFile(sourcePath);
  const tests = readOptionalFile(testPath);

  return {
    codeBlocks: createPackageCodeBlocks(source, tests, readme, {
      readme: "README.md",
      source: "src/index.ts",
      tests: "tests/unit/index.test.ts",
    }),
    dependencies: readDependencyNames(packageJson.dependencies),
    description: readText(packageJson.description, ""),
    devDependencies: readDependencyNames(packageJson.devDependencies),
    directory: relative(workspaceRoot, directory),
    group: "core",
    keywords: readStringArray(packageJson.keywords),
    kind: "svc",
    language: "ts",
    name: readText(packageJson.name, `@common-utilities/${slug}`),
    readme,
    readmePath: relative(workspaceRoot, readmePath),
    slug,
    source,
    sourcePath: relative(workspaceRoot, sourcePath),
    testPath: relative(workspaceRoot, testPath),
    tests,
    version: readText(packageJson.version, "0.0.0"),
  };
}

function readUtility(root: string, category: string, slug: string) {
  const directory = join(root, category, slug, "ts");
  const packagePath = join(directory, "package.json");

  if (!existsSync(packagePath)) {
    return [];
  }

  return [readUtilityRecord(root, directory, category, slug)];
}

function readUtilityRecord(
  root: string,
  directory: string,
  category: string,
  slug: string,
): UtilityRecord {
  const workspaceRoot = dirname(root);
  const packageJson = readJsonRecord(join(directory, "package.json"));
  const readmePath = join(directory, "README.md");
  const sourcePath = join(directory, "src", "index.ts");
  const testPath = join(directory, "src", "index.test.ts");
  const readme = readOptionalFile(readmePath);
  const source = readOptionalFile(sourcePath);
  const tests = readOptionalFile(testPath);

  return {
    category,
    codeBlocks: createPackageCodeBlocks(source, tests, readme, {
      readme: "README.md",
      source: "src/index.ts",
      tests: "src/index.test.ts",
    }),
    dependencies: readDependencyNames(packageJson.dependencies),
    description: readText(packageJson.description, ""),
    devDependencies: readDependencyNames(packageJson.devDependencies),
    directory: relative(workspaceRoot, directory),
    group: category,
    keywords: readStringArray(packageJson.keywords),
    kind: "util",
    language: "ts",
    name: readText(packageJson.name, `@common-utilities/${slug}`),
    readme,
    readmePath: relative(workspaceRoot, readmePath),
    slug,
    source,
    sourcePath: relative(workspaceRoot, sourcePath),
    testPath: relative(workspaceRoot, testPath),
    tests,
    version: readText(packageJson.version, "0.0.0"),
  };
}

function readDirectoryNames(directory: string) {
  try {
    return readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map(({ name }) => name)
      .sort();
  } catch {
    return [];
  }
}

function readJsonRecord(path: string) {
  try {
    const value: unknown = JSON.parse(readFileSync(path, "utf8"));

    if (isRecord(value)) {
      return value;
    }
  } catch {
    return {};
  }

  return {};
}

function readOptionalFile(path: string) {
  if (!existsSync(path)) {
    return "";
  }

  return readFileSync(path, "utf8");
}

function readText(value: unknown, fallback: string) {
  if (typeof value === "string") {
    return value;
  }

  return fallback;
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => typeof item === "string");
}

function readDependencyNames(value: unknown) {
  if (!isRecord(value)) {
    return [];
  }

  return Object.keys(value).sort();
}

function createPackageCodeBlocks(
  source: string,
  tests: string,
  readme: string,
  paths: Record<"readme" | "source" | "tests", string>,
) {
  const sourceBlock = {
    code: source,
    key: "source",
    kind: "source" as const,
    language: "ts",
    path: paths.source,
  };
  const testBlocks = createTestCodeBlocks(tests, paths.tests);
  const readmeBlocks = createReadmeCodeBlocks(readme, paths.readme);
  const blocks = [sourceBlock, ...testBlocks, ...readmeBlocks];

  return blocks.map((block, id) => ({ ...block, id }));
}

function createTestCodeBlocks(tests: string, path: string) {
  if (!tests) {
    return [];
  }

  return [{
    code: tests,
    key: "tests",
    kind: "test" as const,
    language: "ts",
    path,
  }];
}

function createReadmeCodeBlocks(readme: string, path: string) {
  const fencePattern = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;
  const matches = Array.from(readme.matchAll(fencePattern));

  return matches.map((match, index) => {
    const code = match[2] ?? "";
    const key = `readme-${index}`;
    const language = match[1] ?? "text";

    return {
      code,
      key,
      kind: "readme" as const,
      language,
      path,
    };
  });
}

function toPackageSummary(record: PackageRecord) {
  const summary = {
    description: record.description,
    group: record.group,
    kind: record.kind,
    language: record.language,
    name: record.name,
    slug: record.slug,
    tags: readPackageTags(record),
  };

  if (record.kind !== "util") {
    return summary;
  }

  return {
    ...summary,
    category: record.category,
  };
}

function toCodeBlockSummary(codeBlock: UtilityCodeBlock) {
  return {
    id: codeBlock.id,
    key: codeBlock.key,
    kind: codeBlock.kind,
    language: codeBlock.language,
    path: codeBlock.path,
  };
}

function readInstallCommand(
  record: PackageRecord,
  packageManager: string,
) {
  if (packageManager === "copy") {
    return `copy ${record.sourcePath}`;
  }

  return `${packageManager} add ${record.name}`;
}

function createTagStream(tags: readonly string[]) {
  return new ColdObservable<string>((subscriber) => {
    tags.forEach((tag) => {
      subscriber.next(tag);
    });
    subscriber.complete();
  });
}

function readObservableValue<T>(observable: Observable<T>) {
  return new Promise<T>((resolve, reject) => {
    let value: T | null = null;

    observable.subscribe({
      complete: () => {
        if (value !== null) {
          resolve(value);

          return;
        }

        reject(new Error("Observable completed without a value."));
      },
      error: reject,
      next: (nextValue) => {
        value = nextValue;
      },
    });
  });
}

function toRegistryPattern(key: string, index: number): PackagePattern {
  const rank = index + 1;
  const weight = Number((1 / rank).toFixed(3));

  return { key, source: "registry", weight };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  const isObjectValue = typeof value === "object";
  const hasValue = value !== null;
  const isArrayValue = Array.isArray(value);
  const isRecordValue = isObjectValue && hasValue && !isArrayValue;

  return isRecordValue;
}
