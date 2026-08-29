import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { createNewUMcpServer } from "./utils.ts";

test("createNewUMcpServer confirms before applying the generated package", async () => {
  const targetDirectory = mkdtempSync(join(process.cwd(), "tmp-mcp-new-u-"));
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const server = createNewUMcpServer();
  const client = new Client(
    { name: "new-u-test-client", version: "0.0.1" },
    { capabilities: { elicitation: {} } },
  );

  client.setRequestHandler("elicitation/create", async () => ({
    action: "accept",
    content: { confirm: true },
  }));

  try {
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
    const result = await client.callTool({
      arguments: {
        description: "An MCP-created helper",
        name: "mcp-helper",
        targetDirectory,
      },
      name: "new-u",
    });
    const structuredContent = result.structuredContent as {
      packageDirectory: string;
      status: string;
    };

    assert.strictEqual(structuredContent.status, "created");
    assert.match(
      readFileSync(
        join(structuredContent.packageDirectory, "README.md"),
        "utf8",
      ),
      /# mcp-helper/,
    );
  } finally {
    await client.close();
    await server.close();
    rmSync(targetDirectory, { force: true, recursive: true });
  }
});
