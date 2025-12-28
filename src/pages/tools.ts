/**
 * Page domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { toInputSchema } from "../shared/index.js";
import {
  CreatePageInputSchema,
  GetPageInputSchema,
  SearchPagesInputSchema,
  UpdatePageInputSchema,
} from "./schemas.js";
import { PAGE_TOOL_NAMES } from "./types.js";

export const PAGE_TOOLS: Tool[] = [
  {
    name: PAGE_TOOL_NAMES.SEARCH_PAGES,
    description: "Search NotePM pages. Can filter by keyword, note, or tag.",
    inputSchema: toInputSchema(SearchPagesInputSchema),
  },
  {
    name: PAGE_TOOL_NAMES.GET_PAGE,
    description: "Get a NotePM page. Retrieve title, body, tags and other details by page code.",
    inputSchema: toInputSchema(GetPageInputSchema),
  },
  {
    name: PAGE_TOOL_NAMES.CREATE_PAGE,
    description: "Create a new page in NotePM. Note code and title are required.",
    inputSchema: toInputSchema(CreatePageInputSchema),
  },
  {
    name: PAGE_TOOL_NAMES.UPDATE_PAGE,
    description: "Update an existing NotePM page. Page code is required.",
    inputSchema: toInputSchema(UpdatePageInputSchema),
  },
];
