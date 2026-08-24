const fileSchema = {
  type: "object",
  additionalProperties: false,
  required: ["content", "path"],
  properties: {
    content: { type: "string" },
    path: { type: "string" },
  },
} as const;

export const newUInputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  additionalProperties: false,
  required: ["description", "name", "targetDirectory"],
  properties: {
    description: { type: "string", minLength: 1 },
    name: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    targetDirectory: { type: "string", minLength: 1 },
  },
} as const;

export const newUOutputSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  additionalProperties: false,
  required: [
    "diff",
    "files",
    "function",
    "kind",
    "markdown",
    "name",
    "packageDirectory",
    "provenance",
    "status",
  ],
  properties: {
    diff: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["additions", "deletions", "patch", "path"],
        properties: {
          additions: { type: "integer", minimum: 0 },
          deletions: { type: "integer", const: 0 },
          patch: { type: "string" },
          path: { type: "string" },
        },
      },
    },
    files: { type: "array", items: fileSchema },
    function: {
      type: "object",
      additionalProperties: false,
      required: ["name", "path"],
      properties: {
        name: { type: "string" },
        path: { type: "string", const: "src/index.ts" },
      },
    },
    kind: { type: "string", const: "pkg" },
    markdown: { type: "string" },
    name: { type: "string" },
    packageDirectory: { type: "string" },
    provenance: {
      type: "object",
      additionalProperties: false,
      required: [
        "attestations",
        "dependencies",
        "digest",
        "license",
        "sourceCommit",
        "sourceRepository",
        "tests",
      ],
      properties: {
        attestations: { type: "array", items: { type: "string" } },
        dependencies: { type: "array", items: { type: "string" } },
        digest: { type: "string" },
        license: { type: "string", const: "MIT" },
        sourceCommit: { type: ["string", "null"] },
        sourceRepository: { type: "string" },
        tests: { type: "array", items: { type: "string" } },
      },
    },
    status: { type: "string", enum: ["created", "preview"] },
  },
} as const;
