/**
 * MCP Tool Definitions
 */

import { z } from "zod";
import {
  SearchPagesInputSchema,
  GetPageInputSchema,
  CreatePageInputSchema,
  UpdatePageInputSchema,
  DeletePageInputSchema,
} from "./schemas.js";

/**
 * Convert Zod schema to MCP-compatible JSON Schema
 */
function toInputSchema(schema: z.ZodType) {
  return z.toJSONSchema(schema, { target: "draft-07" });
}

export const TOOLS = [
  {
    name: "search_pages",
    description: "Search NotePM pages. Can filter by keyword, note, or tag.",
    inputSchema: toInputSchema(SearchPagesInputSchema),
  },
  {
    name: "get_page",
    description: "Get a NotePM page. Retrieve title, body, tags and other details by page code.",
    inputSchema: toInputSchema(GetPageInputSchema),
  },
  {
    name: "create_page",
    description: "Create a new page in NotePM. Note code and title are required.",
    inputSchema: toInputSchema(CreatePageInputSchema),
  },
  {
    name: "update_page",
    description: "Update an existing NotePM page. Page code is required.",
    inputSchema: toInputSchema(UpdatePageInputSchema),
  },
  {
    name: "delete_page",
    description: "Delete a NotePM page. This action cannot be undone.",
    inputSchema: toInputSchema(DeletePageInputSchema),
  },
];
