/**
 * MCP Tool Definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { TOOL_NAMES } from "./constants.js";
import {
  CreateNoteInputSchema,
  CreatePageInputSchema,
  DeleteNoteInputSchema,
  DeletePageInputSchema,
  GetPageInputSchema,
  ListNotesInputSchema,
  SearchNotesInputSchema,
  SearchPagesInputSchema,
  UpdateNoteInputSchema,
  UpdatePageInputSchema,
} from "./schemas.js";

/**
 * Convert Zod schema to MCP-compatible JSON Schema
 */
function toInputSchema(schema: z.ZodType): Tool["inputSchema"] {
  return z.toJSONSchema(schema, { target: "draft-07" }) as Tool["inputSchema"];
}

export const TOOLS: Tool[] = [
  {
    name: TOOL_NAMES.SEARCH_NOTES,
    description: "Search NotePM notes. Returns a list of notes matching the search criteria.",
    inputSchema: toInputSchema(SearchNotesInputSchema),
  },
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
  {
    name: TOOL_NAMES.LIST_NOTES,
    description: "List all NotePM notes. Returns note codes, names, and descriptions.",
    inputSchema: toInputSchema(ListNotesInputSchema),
  },
  {
    name: TOOL_NAMES.CREATE_NOTE,
    description: "Create a new note in NotePM. Note name and scope are required.",
    inputSchema: toInputSchema(CreateNoteInputSchema),
  },
  {
    name: TOOL_NAMES.UPDATE_NOTE,
    description: "Update an existing NotePM note. Note code is required.",
    inputSchema: toInputSchema(UpdateNoteInputSchema),
  },
  {
    name: TOOL_NAMES.DELETE_NOTE,
    description: "Delete a NotePM note. This action cannot be undone. All pages within the note will also be deleted.",
    inputSchema: toInputSchema(DeleteNoteInputSchema),
  },
];
