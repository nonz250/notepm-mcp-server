/**
 * Tool Constants
 *
 * Centralized constants for tool names to ensure type safety
 * and prevent string duplication across the codebase.
 */

/**
 * Tool names used throughout the MCP server
 */
export const TOOL_NAMES = {
  SEARCH_PAGES: "search_pages",
  GET_PAGE: "get_page",
  CREATE_PAGE: "create_page",
  UPDATE_PAGE: "update_page",
  DELETE_PAGE: "delete_page",
  LIST_NOTES: "list_notes",
  CREATE_NOTE: "create_note",
} as const;

/**
 * Type representing valid tool names
 */
export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES];
