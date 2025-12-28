/**
 * Attachment domain handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { parseInput, success } from "../shared/result.js";
import { AttachmentClient } from "./client.js";
import { SearchAttachmentsInputSchema, UploadAttachmentInputSchema } from "./schemas.js";
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
    `   - Created at: ${attachment.created_at}`,
  ].join("\n");
}

/**
 * Check if the tool name is an attachment tool
 */
export function isAttachmentToolName(name: string): name is AttachmentToolName {
  return Object.values(ATTACHMENT_TOOL_NAMES).includes(name as AttachmentToolName);
}

/**
 * Handle search_attachments tool
 */
async function handleSearchAttachments(client: AttachmentClient, args: unknown): Promise<CallToolResult> {
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

/**
 * Handle upload_attachment tool
 */
async function handleUploadAttachment(client: AttachmentClient, args: unknown): Promise<CallToolResult> {
  const { file_name, file_data, note_code, page_code } = parseInput(UploadAttachmentInputSchema, args);

  const result = await client.upload({
    file_name,
    file_data,
    note_code,
    page_code,
  });

  const attachment = result.attachment;
  const pageInfo = attachment.page_code ? `\n- Page: ${attachment.page_code}` : "";

  return success(
    `File uploaded successfully!\n\n` +
      `**${attachment.file_name}**\n` +
      `- File ID: ${attachment.file_id}\n` +
      `- Size: ${formatFileSize(attachment.file_size)}\n` +
      `- Note: ${attachment.note_code}${pageInfo}`
  );
}

/**
 * Handle attachment tool calls
 */
export async function handleAttachmentToolCall(
  client: AttachmentClient,
  name: AttachmentToolName,
  args: unknown
): Promise<CallToolResult> {
  switch (name) {
    case ATTACHMENT_TOOL_NAMES.SEARCH_ATTACHMENTS:
      return handleSearchAttachments(client, args);
    case ATTACHMENT_TOOL_NAMES.UPLOAD_ATTACHMENT:
      return handleUploadAttachment(client, args);
  }
}
