/**
 * Note domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { toInputSchema } from "../shared/index.js";
import { ListNotesInputSchema } from "./schemas.js";
import { NOTE_TOOL_NAMES } from "./types.js";

export const NOTE_TOOLS: Tool[] = [
  {
    name: NOTE_TOOL_NAMES.LIST_NOTES,
    description: "List all NotePM notes. Returns note codes, names, and descriptions.",
    inputSchema: toInputSchema(ListNotesInputSchema),
  },
];
