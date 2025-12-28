/**
 * Tag domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { toInputSchema } from "../shared/index.js";
import {
  CreateTagInputSchema,
  DeleteTagInputSchema,
  ListTagsInputSchema,
} from "./schemas.js";
import { TAG_TOOL_NAMES } from "./types.js";

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
