/**
 * Folder domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { toInputSchema } from "../shared/index.js";
import { ListFoldersInputSchema } from "./schemas.js";
import { FOLDER_TOOL_NAMES } from "./types.js";

export const FOLDER_TOOLS: Tool[] = [
  {
    name: FOLDER_TOOL_NAMES.LIST_FOLDERS,
    description: "List folders in a NotePM note. Returns folder hierarchy with IDs and names.",
    inputSchema: toInputSchema(ListFoldersInputSchema),
  },
];
