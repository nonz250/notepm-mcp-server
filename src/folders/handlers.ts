/**
 * Folder domain handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { parseInput, success } from "../shared/result.js";
import { FolderClient } from "./client.js";
import { ListFoldersInputSchema } from "./schemas.js";
import type { Folder, FolderToolName } from "./types.js";
import { FOLDER_TOOL_NAMES } from "./types.js";

/**
 * Build folder tree structure for display
 */
function buildFolderTree(folders: Folder[]): string {
  // Get root folders (no parent)
  const rootFolders = folders.filter((f) => f.parent_folder_id === null);

  // Get child folders for a given parent
  const getChildren = (parentId: number): Folder[] =>
    folders.filter((f) => f.parent_folder_id === parentId);

  // Recursively format folder with children
  const formatWithChildren = (folder: Folder, indent: number): string[] => {
    const prefix = "  ".repeat(indent);
    const lines = [`${prefix}- **${folder.name}** (id: ${String(folder.folder_id)})`];
    const children = getChildren(folder.folder_id);
    for (const child of children) {
      lines.push(...formatWithChildren(child, indent + 1));
    }
    return lines;
  };

  const lines: string[] = [];
  for (const root of rootFolders) {
    lines.push(...formatWithChildren(root, 0));
  }

  return lines.join("\n");
}

/**
 * Check if the tool name is a folder tool
 */
export function isFolderToolName(name: string): name is FolderToolName {
  return Object.values(FOLDER_TOOL_NAMES).includes(name as FolderToolName);
}

/**
 * Handle folder tool calls
 */
export async function handleFolderToolCall(
  client: FolderClient,
  _name: FolderToolName,
  args: unknown
): Promise<CallToolResult> {
  // Currently only list_folders is supported
  const { note_code } = parseInput(ListFoldersInputSchema, args);
  const result = await client.list({ note_code });

  if (result.folders.length === 0) {
    return success("No folders found in this note.");
  }

  const folderTree = buildFolderTree(result.folders);
  return success(`Folders in note "${note_code}":\n\n${folderTree}`);
}
