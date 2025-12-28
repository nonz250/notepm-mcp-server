/**
 * MCP Tools Aggregator
 *
 * Aggregates all domain tools into a single list for the MCP server.
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { NOTE_TOOLS } from "../notes/tools.js";
import { PAGE_TOOLS } from "../pages/tools.js";
import { TAG_TOOLS } from "../tags/tools.js";

/**
 * All available tools for the MCP server
 */
export const TOOLS: Tool[] = [...PAGE_TOOLS, ...NOTE_TOOLS, ...TAG_TOOLS];
