/**
 * Input Schema Definitions (Zod)
 */

import { z } from "zod";

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
