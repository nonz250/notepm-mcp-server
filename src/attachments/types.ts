/**
 * Attachment domain types
 */

/** Attachment information */
export interface Attachment {
  file_id: string;
  file_name: string;
  file_size: number;
  note_code: string;
  page_code: string | null;
  comment_number: number | null;
  download_url: string;
  created_at: string;
}

/** Attachments list response */
export interface AttachmentsResponse {
  attachments: Attachment[];
  meta: {
    previous_page: string | null;
    next_page: string | null;
    page: number;
    per_page: number;
    total: number;
  };
}

/** Search attachments parameters */
export interface SearchAttachmentsParams {
  q?: string;
  file_name?: string;
  note_code?: string;
  page_code?: string;
  include_archived?: boolean;
  page?: number;
  per_page?: number;
}

/** Upload attachment parameters */
export interface UploadAttachmentParams {
  file_name: string;
  file_data: string; // Base64 encoded file content
  note_code: string;
  page_code?: string;
}

/** Upload attachment response */
export interface UploadAttachmentResponse {
  attachment: Attachment;
}

/** Tool name constants for attachments */
export const ATTACHMENT_TOOL_NAMES = {
  SEARCH_ATTACHMENTS: "search_attachments",
  UPLOAD_ATTACHMENT: "upload_attachment",
} as const;

/** Type representing valid attachment tool names */
export type AttachmentToolName = (typeof ATTACHMENT_TOOL_NAMES)[keyof typeof ATTACHMENT_TOOL_NAMES];
