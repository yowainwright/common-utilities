# new-u

Create TypeScript utilities through a reviewable copy/paste workflow.

## Interfaces

- `new-u <name> <description> [target-directory]` creates a utility from the CLI.
- `pnpm serve` exposes `POST /new-u` for previews and explicit writes.
- `pnpm mcp` serves the `new-u` tool over stdio using the official MCP SDK.

The preview includes generated TypeScript files, Markdown, structured diff data, and provenance. Writing requires explicit confirmation in the MCP flow or `{ "write": true }` in REST.
