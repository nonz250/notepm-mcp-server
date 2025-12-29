/**
 * Attachment domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { toInputSchema } from "../shared/index.js";
import { SearchAttachmentsInputSchema, UploadAttachmentInputSchema } from "./schemas.js";
import { ATTACHMENT_TOOL_NAMES } from "./types.js";

export const ATTACHMENT_TOOLS: Tool[] = [
  {
    name: ATTACHMENT_TOOL_NAMES.SEARCH_ATTACHMENTS,
    description: "Search attachments in NotePM. Can filter by keyword, file name, note, or page.",
    inputSchema: toInputSchema(SearchAttachmentsInputSchema),
  },
  {
    name: ATTACHMENT_TOOL_NAMES.UPLOAD_ATTACHMENT,
    description:
      "Upload a file attachment to NotePM. Requires base64-encoded file content, file name, and note code.",
    inputSchema: toInputSchema(UploadAttachmentInputSchema),
  },
];
