/**
 * Attachment domain handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { parseInput, success } from "../shared/result.js";
import { AttachmentClient } from "./client.js";
import { SearchAttachmentsInputSchema } from "./schemas.js";
import type { Attachment, AttachmentToolName } from "./types.js";
import { ATTACHMENT_TOOL_NAMES } from "./types.js";

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format attachment for list display
 */
function formatAttachmentListItem(attachment: Attachment, index: number): string {
  const pageInfo = attachment.page_code ? ` (page: ${attachment.page_code})` : "";
  return [
    `${String(index + 1)}. **${attachment.file_name}**`,
    `   - File ID: ${attachment.file_id}`,
    `   - Size: ${formatFileSize(attachment.file_size)}`,
    `   - Note: ${attachment.note_code}${pageInfo}`,
    `   - Uploaded by: ${attachment.created_by.name}`,
    `   - Uploaded at: ${attachment.created_at}`,
  ].join("\n");
}

/**
 * Check if the tool name is an attachment tool
 */
export function isAttachmentToolName(name: string): name is AttachmentToolName {
  return Object.values(ATTACHMENT_TOOL_NAMES).includes(name as AttachmentToolName);
}

/**
 * Handle attachment tool calls
 */
export async function handleAttachmentToolCall(
  client: AttachmentClient,
  _name: AttachmentToolName,
  args: unknown
): Promise<CallToolResult> {
  // Currently only search_attachments is supported
  const { q, file_name, note_code, page_code, include_archived, page, per_page } = parseInput(
    SearchAttachmentsInputSchema,
    args
  );
  const result = await client.search({
    q,
    file_name,
    note_code,
    page_code,
    include_archived,
    page,
    per_page,
  });

  if (result.attachments.length === 0) {
    return success("No attachments found.");
  }

  const attachmentList = result.attachments.map((a, i) => formatAttachmentListItem(a, i)).join("\n\n");

  return success(
    `Attachments: showing ${String(result.attachments.length)} of ${String(result.meta.total)} attachments\n\n${attachmentList}`
  );
}
