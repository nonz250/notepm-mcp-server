/**
 * Attachment domain schemas (Zod)
 */
import { z } from "zod";

// ============================================================
// Zod Schemas
// ============================================================

export const SearchAttachmentsInputSchema = z.object({
  q: z.string().optional().describe("Search keyword"),
  file_name: z.string().optional().describe("Filter by file name"),
  note_code: z.string().optional().describe("Filter by note code"),
  page_code: z.string().optional().describe("Filter by page code"),
  include_archived: z.boolean().optional().describe("Include archived attachments (default: false)"),
  page: z.number().min(1).optional().describe("Page number (default: 1)"),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe("Number of results (1-100, default: 20)"),
});

export const UploadAttachmentInputSchema = z.object({
  file_name: z.string().min(1).describe("File name with extension (e.g., 'document.pdf')"),
  file_data: z.string().min(1).describe("Base64 encoded file content"),
  note_code: z.string().min(1).describe("Note code to attach the file to"),
  page_code: z.string().optional().describe("Page code to attach the file to (optional)"),
});

// ============================================================
// Inferred Types
// ============================================================

/** Inferred type for search attachments input */
export type SearchAttachmentsInput = z.infer<typeof SearchAttachmentsInputSchema>;

/** Inferred type for upload attachment input */
export type UploadAttachmentInput = z.infer<typeof UploadAttachmentInputSchema>;
