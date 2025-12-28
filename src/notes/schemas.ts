/**
 * Note domain schemas (Zod)
 */
import { z } from "zod";

// ============================================================
// Zod Schemas
// ============================================================

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

export const GetNoteInputSchema = z.object({
  note_code: z.string().min(1).describe("Note code"),
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

export const ArchiveNoteInputSchema = z.object({
  note_code: z.string().min(1).describe("Note code to archive"),
});

export const UnarchiveNoteInputSchema = z.object({
  note_code: z.string().min(1).describe("Note code to unarchive"),
});

// ============================================================
// Inferred Types
// ============================================================

/** Inferred type for list notes input */
export type ListNotesInput = z.infer<typeof ListNotesInputSchema>;

/** Inferred type for get note input */
export type GetNoteInput = z.infer<typeof GetNoteInputSchema>;

/** Inferred type for create note input */
export type CreateNoteInput = z.infer<typeof CreateNoteInputSchema>;

/** Inferred type for update note input */
export type UpdateNoteInput = z.infer<typeof UpdateNoteInputSchema>;

/** Inferred type for delete note input */
export type DeleteNoteInput = z.infer<typeof DeleteNoteInputSchema>;

/** Inferred type for archive note input */
export type ArchiveNoteInput = z.infer<typeof ArchiveNoteInputSchema>;

/** Inferred type for unarchive note input */
export type UnarchiveNoteInput = z.infer<typeof UnarchiveNoteInputSchema>;
