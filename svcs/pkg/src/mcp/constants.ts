import * as z from "zod/v4";
import { namePattern } from "../constants.ts";

export const serverDescription =
  "Create TypeScript utilities with reviewable copy/paste output.";
export const serverName = "common-utilities";
export const serverVersion = "0.0.1";
export const toolDescription = "Preview and create a TypeScript utility package.";
export const toolNames = ["pkg", "new-u"] as const;

export const inputSchema = z
  .object({
    description: z.string().min(1),
    name: z.string().regex(namePattern),
    targetDirectory: z.string().min(1),
  })
  .strict();
export const confirmationSchema = z.object({ confirm: z.boolean() });
