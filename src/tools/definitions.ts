/**
 * MCP Tool Definitions
 */
import { z } from "zod";
import type { JsonSchema7Type } from "zod-to-json-schema";

import { TOOL_NAMES } from "./constants.js";
import {
  CreatePageInputSchema,
  DeletePageInputSchema,
  GetPageInputSchema,
  SearchPagesInputSchema,
  UpdatePageInputSchema,
} from "./schemas.js";

/**
 * MCP Tool definition interface
 */
interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: JsonSchema7Type;
}

/**
 * Convert Zod schema to MCP-compatible JSON Schema
 */
function toInputSchema(schema: z.ZodType): JsonSchema7Type {
  return z.toJSONSchema(schema, { target: "draft-07" }) as JsonSchema7Type;
}

export const TOOLS: ToolDefinition[] = [
  {
    name: TOOL_NAMES.SEARCH_PAGES,
    description: "Search NotePM pages. Can filter by keyword, note, or tag.",
    inputSchema: toInputSchema(SearchPagesInputSchema),
  },
  {
    name: TOOL_NAMES.GET_PAGE,
    description: "Get a NotePM page. Retrieve title, body, tags and other details by page code.",
    inputSchema: toInputSchema(GetPageInputSchema),
  },
  {
    name: TOOL_NAMES.CREATE_PAGE,
    description: "Create a new page in NotePM. Note code and title are required.",
    inputSchema: toInputSchema(CreatePageInputSchema),
  },
  {
    name: TOOL_NAMES.UPDATE_PAGE,
    description: "Update an existing NotePM page. Page code is required.",
    inputSchema: toInputSchema(UpdatePageInputSchema),
  },
  {
    name: TOOL_NAMES.DELETE_PAGE,
    description: "Delete a NotePM page. This action cannot be undone.",
    inputSchema: toInputSchema(DeletePageInputSchema),
  },
];
