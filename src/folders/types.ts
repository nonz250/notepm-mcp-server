/**
 * Folder domain types
 */

/** Folder information */
export interface Folder {
  folder_id: number;
  name: string;
  parent_folder_id: number | null;
}

/** Folders list response */
export interface FoldersResponse {
  folders: Folder[];
}

/** List folders parameters */
export interface ListFoldersParams {
  note_code: string;
}

/** Tool name constants for folders */
export const FOLDER_TOOL_NAMES = {
  LIST_FOLDERS: "list_folders",
} as const;

/** Type representing valid folder tool names */
export type FolderToolName = (typeof FOLDER_TOOL_NAMES)[keyof typeof FOLDER_TOOL_NAMES];
