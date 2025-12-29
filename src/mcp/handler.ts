/**
 * MCP Handler Router
 *
 * Routes tool calls to the appropriate domain handler.
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { AttachmentClient, handleAttachmentToolCall, isAttachmentToolName } from "../attachments/index.js";
import { FolderClient, handleFolderToolCall, isFolderToolName } from "../folders/index.js";
import { handleNoteToolCall, isNoteToolName, NoteClient } from "../notes/index.js";
import { handlePageToolCall, isPageToolName, PageClient } from "../pages/index.js";
import { error, InputError, NotePMAPIError } from "../shared/index.js";
import { handleTagToolCall, isTagToolName, TagClient } from "../tags/index.js";

interface Clients {
  attachments: AttachmentClient;
  folders: FolderClient;
  notes: NoteClient;
  pages: PageClient;
  tags: TagClient;
}

/**
 * Handle tool call by routing to appropriate domain handler
 */
export async function handleToolCall(
  clients: Clients,
  name: string,
  args: unknown
): Promise<CallToolResult> {
  try {
    if (isAttachmentToolName(name)) {
      return await handleAttachmentToolCall(clients.attachments, name, args);
    }

    if (isFolderToolName(name)) {
      return await handleFolderToolCall(clients.folders, name, args);
    }

    if (isNoteToolName(name)) {
      return await handleNoteToolCall(clients.notes, name, args);
    }

    if (isPageToolName(name)) {
      return await handlePageToolCall(clients.pages, name, args);
    }

    if (isTagToolName(name)) {
      return await handleTagToolCall(clients.tags, name, args);
    }

    return error(`Unknown tool: ${name}`);
  } catch (err) {
    if (err instanceof InputError) {
      return error(`Input error: ${err.message}`);
    }
    if (err instanceof NotePMAPIError) {
      return error(err.message);
    }
    throw err;
  }
}
