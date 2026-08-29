# pkg

Create TypeScript utilities through a reviewable copy/paste workflow.

## Interfaces

- `pkg <name> <description> [target-directory]` creates a utility from the CLI.
- `new-u` and `create-pkg` remain CLI aliases.
- `pnpm mcp` serves the `pkg` tool over stdio using the official MCP SDK.

The preview includes generated TypeScript files, Markdown, structured diff data, and provenance. Writing requires explicit confirmation in the MCP flow.
