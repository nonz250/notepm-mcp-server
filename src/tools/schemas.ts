/**
 * Input Schema Definitions (Zod)
 *
 * These schemas are the single source of truth for input validation.
 * Types are inferred from schemas to avoid duplication.
 */
import { z } from "zod";

// ============================================================
// Zod Schemas
// ============================================================

export const SearchPagesInputSchema = z.object({
  query: z.string().optional().describe("Search keyword"),
  note_code: z.string().optional().describe("Note code (search within specific note)"),
  tag_name: z.string().optional().describe("Filter by tag name"),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe("Number of results (1-100, default: 20)"),
});

export const GetPageInputSchema = z.object({
  page_code: z.string().describe("Page code"),
});

export const CreatePageInputSchema = z.object({
  note_code: z.string().describe("Note code to create page in"),
  title: z.string().max(100).describe("Page title (max 100 characters)"),
  body: z.string().optional().describe("Page body (Markdown format)"),
  memo: z.string().max(255).optional().describe("Memo (max 255 characters)"),
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

export const UpdatePageInputSchema = z.object({
  page_code: z.string().describe("Page code to update"),
  title: z.string().max(100).optional().describe("Page title (max 100 characters)"),
  body: z.string().optional().describe("Page body (Markdown format)"),
  memo: z.string().max(255).optional().describe("Memo (max 255 characters)"),
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

export const DeletePageInputSchema = z.object({
  page_code: z.string().describe("Page code to delete"),
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

/** Inferred type for delete page input */
export type DeletePageInput = z.infer<typeof DeletePageInputSchema>;
