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

// ============================================================
// Inferred Types
// ============================================================

/** Inferred type for list notes input */
export type ListNotesInput = z.infer<typeof ListNotesInputSchema>;
