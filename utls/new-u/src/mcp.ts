import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createNewUMcpServer } from "./mcp-server.ts";

serveStdio(createNewUMcpServer);
