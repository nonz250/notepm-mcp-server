/**
 * Tag domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import {
  CreateTagInputSchema,
  DeleteTagInputSchema,
  ListTagsInputSchema,
} from "./schemas.js";
import { TAG_TOOL_NAMES } from "./types.js";

/**
 * Convert Zod schema to MCP-compatible JSON Schema
 */
function toInputSchema(schema: z.ZodType): Tool["inputSchema"] {
  return z.toJSONSchema(schema, { target: "draft-07" }) as Tool["inputSchema"];
}

export const TAG_TOOLS: Tool[] = [
  {
    name: TAG_TOOL_NAMES.LIST_TAGS,
    description: "List all tags in NotePM. Can filter by note code.",
    inputSchema: toInputSchema(ListTagsInputSchema),
  },
  {
    name: TAG_TOOL_NAMES.CREATE_TAG,
    description: "Create a new tag in NotePM.",
    inputSchema: toInputSchema(CreateTagInputSchema),
  },
  {
    name: TAG_TOOL_NAMES.DELETE_TAG,
    description: "Delete a tag from NotePM. This action cannot be undone.",
    inputSchema: toInputSchema(DeleteTagInputSchema),
  },
];
