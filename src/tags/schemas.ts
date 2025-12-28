/**
 * Tag domain schemas (Zod)
 */
import { z } from "zod";

// ============================================================
// Zod Schemas
// ============================================================

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

/** Inferred type for list tags input */
export type ListTagsInput = z.infer<typeof ListTagsInputSchema>;

/** Inferred type for create tag input */
export type CreateTagInput = z.infer<typeof CreateTagInputSchema>;
