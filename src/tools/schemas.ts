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
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

export const UpdatePageInputSchema = z.object({
  page_code: z.string().min(1).describe("Page code to update"),
  title: z.string().max(100).optional().describe("Page title (max 100 characters)"),
  body: z.string().optional().describe("Page body (Markdown format)"),
  memo: z.string().max(255).optional().describe("Memo (max 255 characters)"),
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

export const DeletePageInputSchema = z.object({
  page_code: z.string().min(1).describe("Page code to delete"),
});

export const ListNotesInputSchema = z.object({
  include_archived: z.boolean().optional().describe("Include archived notes"),
  page: z.number().min(1).optional().describe("Page number (default: 1)"),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe("Number of results (1-100, default: 20)"),
});

export const CreateNoteInputSchema = z.object({
  name: z.string().min(1).max(30).describe("Note name (1-30 characters)"),
  description: z.string().max(200).optional().describe("Note description (max 200 characters)"),
  scope: z
    .enum(["open", "private"])
    .describe("Visibility scope ('open': all members, 'private': specified members only)"),
  groups: z.array(z.string()).optional().describe("Array of group names to grant access (only for private scope)"),
  users: z.array(z.string()).optional().describe("Array of user codes to grant access (only for private scope)"),
});

export const UpdateNoteInputSchema = z.object({
  note_code: z.string().min(1).describe("Note code to update"),
  name: z.string().max(30).optional().describe("Note name (max 30 characters)"),
  description: z.string().max(200).optional().describe("Note description (max 200 characters)"),
  scope: z
    .enum(["open", "private"])
    .optional()
    .describe("Visibility scope ('open': all members, 'private': specified members only)"),
  groups: z.array(z.string()).optional().describe("Array of group names to grant access (only for private scope)"),
  users: z.array(z.string()).optional().describe("Array of user codes to grant access (only for private scope)"),
});

export const DeleteNoteInputSchema = z.object({
  note_code: z.string().min(1).describe("Note code to delete"),
});

export const ListTagsInputSchema = z.object({
  note_code: z.string().optional().describe("Note code (list tags within specific note)"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(50)
    .describe("Number of results (1-100, default: 50)"),
});

export const CreateTagInputSchema = z.object({
  name: z.string().min(1).max(100).describe("Tag name (1-100 characters)"),
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

/** Inferred type for list notes input */
export type ListNotesInput = z.infer<typeof ListNotesInputSchema>;

/** Inferred type for create note input */
export type CreateNoteInput = z.infer<typeof CreateNoteInputSchema>;

/** Inferred type for update note input */
export type UpdateNoteInput = z.infer<typeof UpdateNoteInputSchema>;

/** Inferred type for delete note input */
export type DeleteNoteInput = z.infer<typeof DeleteNoteInputSchema>;

/** Inferred type for list tags input */
export type ListTagsInput = z.infer<typeof ListTagsInputSchema>;

/** Inferred type for create tag input */
export type CreateTagInput = z.infer<typeof CreateTagInputSchema>;
