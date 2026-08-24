import {
  acceptedContent,
  fromJsonSchema,
  inputRequired,
  McpServer,
} from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { applyNewU, generateNewU } from "./new-u.ts";
import { newUOutputSchema } from "./schema.ts";
import type { NewUInput } from "./types.ts";

const inputSchema = z
  .object({
    description: z.string().min(1),
    name: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    targetDirectory: z.string().min(1),
  })
  .strict();
const confirmationSchema = z.object({ confirm: z.boolean() });

export function createNewUMcpServer() {
  const server = new McpServer({
    description:
      "Create TypeScript utilities with reviewable copy/paste output.",
    name: "common-utilities",
    version: "0.0.1",
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
        description: "Preview and create a TypeScript utility package.",
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
          const preview = generateNewU(input as NewUInput);
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

        const resource = applyNewU(input as NewUInput);

        return {
          content: [{ type: "text", text: resource.markdown }],
          structuredContent: resource,
        };
      },
    );
  };

  registerTool("pkg");
  registerTool("new-u");

  return server;
}
