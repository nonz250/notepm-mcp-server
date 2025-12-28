/**
 * Attachment domain types
 */

/** User reference in attachment */
export interface AttachmentUser {
  user_code: string;
  name: string;
}

/** Attachment information */
export interface Attachment {
  file_id: string;
  file_name: string;
  file_size: number;
  note_code: string;
  page_code: string | null;
  created_at: string;
  created_by: AttachmentUser;
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

/** Tool name constants for attachments */
export const ATTACHMENT_TOOL_NAMES = {
  SEARCH_ATTACHMENTS: "search_attachments",
} as const;

/** Type representing valid attachment tool names */
export type AttachmentToolName = (typeof ATTACHMENT_TOOL_NAMES)[keyof typeof ATTACHMENT_TOOL_NAMES];
