import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createNewUMcpServer } from "./utils.ts";

serveStdio(createNewUMcpServer);
