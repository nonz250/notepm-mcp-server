/**
 * Folder domain schemas (Zod)
 */
import { z } from "zod";

// ============================================================
// Zod Schemas
// ============================================================

export const ListFoldersInputSchema = z.object({
  note_code: z.string().min(1).describe("Note code to list folders from"),
});

// ============================================================
// Inferred Types
// ============================================================

/** Inferred type for list folders input */
export type ListFoldersInput = z.infer<typeof ListFoldersInputSchema>;
