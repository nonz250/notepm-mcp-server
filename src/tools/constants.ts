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
  GET_NOTE: "get_note",
  CREATE_NOTE: "create_note",
  UPDATE_NOTE: "update_note",
  DELETE_NOTE: "delete_note",
  ARCHIVE_NOTE: "archive_note",
  LIST_TAGS: "list_tags",
  CREATE_TAG: "create_tag",
  DELETE_TAG: "delete_tag",
} as const;

/**
 * Type representing valid tool names
 */
export type ToolName = (typeof TOOL_NAMES)[keyof typeof TOOL_NAMES];
