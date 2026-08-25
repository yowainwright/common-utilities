export type NewUInput = Readonly<{
  description: string;
  name: string;
  targetDirectory: string;
}>;

export type NewUFile = Readonly<{
  content: string;
  path: string;
}>;

export type NewUDiff = Readonly<{
  additions: number;
  deletions: number;
  patch: string;
  path: string;
}>;

export type NewUProvenance = Readonly<{
  attestations: readonly string[];
  dependencies: readonly string[];
  digest: string;
  license: "MIT";
  sourceCommit: string | null;
  sourceRepository: string;
  tests: readonly string[];
}>;

export type NewUResource = Readonly<{
  diff: readonly NewUDiff[];
  files: readonly NewUFile[];
  function: Readonly<{
    name: string;
    path: "src/index.ts";
  }>;
  kind: "pkg";
  markdown: string;
  name: string;
  packageDirectory: string;
  provenance: NewUProvenance;
  status: "created" | "preview";
}>;
