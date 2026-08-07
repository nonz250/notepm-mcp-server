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

// ============================================================
// Inferred Types
// ============================================================

/** Inferred type for search attachments input */
export type SearchAttachmentsInput = z.infer<typeof SearchAttachmentsInputSchema>;
