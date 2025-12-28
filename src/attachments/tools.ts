/**
 * Attachment domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { toInputSchema } from "../shared/index.js";
import { SearchAttachmentsInputSchema } from "./schemas.js";
import { ATTACHMENT_TOOL_NAMES } from "./types.js";

export const ATTACHMENT_TOOLS: Tool[] = [
  {
    name: ATTACHMENT_TOOL_NAMES.SEARCH_ATTACHMENTS,
    description: "Search attachments in NotePM. Can filter by keyword, file name, note, or page.",
    inputSchema: toInputSchema(SearchAttachmentsInputSchema),
  },
];
