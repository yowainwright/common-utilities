import {
  acceptedContent,
  fromJsonSchema,
  inputRequired,
  McpServer,
} from "@modelcontextprotocol/server";
import { applyNewU, generateNewU } from "../index.ts";
import { newUOutputSchema } from "../constants.ts";
import {
  confirmationSchema,
  inputSchema,
  serverDescription,
  serverName,
  serverVersion,
  toolDescription,
  toolNames,
} from "./constants.ts";
import type { McpInput } from "./types.ts";

export function createNewUMcpServer() {
  const server = new McpServer({
    description: serverDescription,
    name: serverName,
    version: serverVersion,
  });

  const registerTool = (toolName: string) => {
    server.registerTool(
      toolName,
      {
        annotations: {
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
          readOnlyHint: false,
        },
        description: toolDescription,
        inputSchema,
        outputSchema: fromJsonSchema(newUOutputSchema),
      },
      async (input, context) => {
        const confirmed = acceptedContent(
          context.mcpReq.inputResponses,
          "confirm",
          confirmationSchema,
        );

        if (confirmed?.confirm !== true) {
          const preview = generateNewU(input as McpInput);
          const diff = preview.diff.map(({ patch }) => patch).join("\n");

          return inputRequired({
            inputRequests: {
              confirm: inputRequired.elicit({
                message: `Create ${preview.name} at ${preview.packageDirectory}?\n\n${diff}`,
                requestedSchema: confirmationSchema,
              }),
            },
          });
        }

        const resource = applyNewU(input as McpInput);

        return {
          content: [{ type: "text", text: resource.markdown }],
          structuredContent: resource,
        };
      },
    );
  };

  toolNames.forEach(registerTool);

  return server;
}
