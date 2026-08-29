export type UtilityCodeBlock = Readonly<{
  code: string;
  id: number;
  key: string;
  kind: "readme" | "source" | "test";
  language: string;
  path: string;
}>;

export type PackageKind = "svc" | "util";

export type PackageRecord = Readonly<{
  category?: string;
  codeBlocks: readonly UtilityCodeBlock[];
  dependencies: readonly string[];
  description: string;
  devDependencies: readonly string[];
  directory: string;
  group: string;
  keywords: readonly string[];
  kind: PackageKind;
  language: "ts" | "unknown";
  name: string;
  readme: string;
  readmePath: string;
  slug: string;
  source: string;
  sourcePath: string;
  testPath: string;
  tests: string;
  version: string;
}>;

export type UtilityRecord = PackageRecord & Readonly<{
  category: string;
  group: string;
  kind: "util";
  language: "ts";
}>;

export type PackageFilters = Readonly<{
  group?: string;
  kind?: string;
}>;

export type PackagePattern = Readonly<{
  key: string;
  source: "registry";
  weight: number;
}>;
