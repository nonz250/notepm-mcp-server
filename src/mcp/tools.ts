/**
 * MCP Tools Aggregator
 *
 * Aggregates all domain tools into a single list for the MCP server.
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { ATTACHMENT_TOOLS } from "../attachments/tools.js";
import { FOLDER_TOOLS } from "../folders/tools.js";
import { NOTE_TOOLS } from "../notes/tools.js";
import { PAGE_TOOLS } from "../pages/tools.js";
import { TAG_TOOLS } from "../tags/tools.js";

/**
 * All available tools for the MCP server
 */
export const TOOLS: Tool[] = [...ATTACHMENT_TOOLS, ...FOLDER_TOOLS, ...NOTE_TOOLS, ...PAGE_TOOLS, ...TAG_TOOLS];
