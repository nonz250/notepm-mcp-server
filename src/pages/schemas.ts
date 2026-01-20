/**
 * Page domain schemas (Zod)
 */
import { z } from "zod";

// ============================================================
// Zod Schemas
// ============================================================

export const SearchPagesInputSchema = z.object({
  query: z.string().optional().describe("Search keyword"),
  only_title: z.boolean().optional().describe("Search only in page titles (default: false)"),
  include_archived: z.boolean().optional().describe("Include archived pages (default: false)"),
  note_code: z.string().optional().describe("Note code (search within specific note)"),
  tag_name: z.string().optional().describe("Filter by tag name"),
  page: z.number().min(1).optional().describe("Page number (default: 1)"),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe("Number of results (1-100, default: 20)"),
});

export const GetPageInputSchema = z.object({
  page_code: z.string().min(1).describe("Page code"),
});

export const CreatePageInputSchema = z.object({
  note_code: z.string().min(1).describe("Note code to create page in"),
  title: z.string().min(1).max(100).describe("Page title (1-100 characters)"),
  body: z.string().optional().describe("Page body (Markdown format)"),
  memo: z.string().max(255).optional().describe("Memo (max 255 characters)"),
  folder_id: z.number().optional().describe("Folder ID to create page in (if omitted, created at note root)"),
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

export const UpdatePageInputSchema = z.object({
  page_code: z.string().min(1).describe("Page code to update"),
  note_code: z.string().optional().describe("Note code (required when specifying folder_id)"),
  title: z.string().max(100).optional().describe("Page title (max 100 characters)"),
  body: z.string().optional().describe("Page body (Markdown format)"),
  memo: z.string().max(255).optional().describe("Memo (max 255 characters)"),
  folder_id: z.number().optional().describe("Folder ID to move page to (requires note_code)"),
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

// ============================================================
// Inferred Types
// ============================================================

/** Inferred type for search pages input */
export type SearchPagesInput = z.infer<typeof SearchPagesInputSchema>;

/** Inferred type for get page input */
export type GetPageInput = z.infer<typeof GetPageInputSchema>;

/** Inferred type for create page input */
export type CreatePageInput = z.infer<typeof CreatePageInputSchema>;

/** Inferred type for update page input */
export type UpdatePageInput = z.infer<typeof UpdatePageInputSchema>;
