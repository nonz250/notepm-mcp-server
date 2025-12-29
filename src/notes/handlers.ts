/**
 * Note domain handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { parseInput, success } from "../shared/result.js";
import { NoteClient } from "./client.js";
import { ListNotesInputSchema } from "./schemas.js";
import type { Note, NoteToolName } from "./types.js";
import { NOTE_TOOL_NAMES } from "./types.js";

/**
 * Format note information for list display
 */
function formatNoteListItem(note: Note, index: number): string {
  const status = note.archived ? " [archived]" : "";
  const scope = note.scope === "private" ? " (private)" : "";
  return `${String(index + 1)}. **${note.name}**${status}${scope} (code: ${note.note_code})\n   - ${note.description || "(No description)"}`;
}

/**
 * Check if the tool name is a note tool
 */
export function isNoteToolName(name: string): name is NoteToolName {
  return Object.values(NOTE_TOOL_NAMES).includes(name as NoteToolName);
}

/**
 * Handle note tool calls
 */
export async function handleNoteToolCall(
  client: NoteClient,
  name: NoteToolName,
  args: unknown
): Promise<CallToolResult> {
  switch (name) {
    case NOTE_TOOL_NAMES.LIST_NOTES: {
      const { include_archived, page, per_page } = parseInput(ListNotesInputSchema, args);
      const result = await client.list({ include_archived, page, per_page });

      if (result.notes.length === 0) {
        return success("No notes found.");
      }

      const noteList = result.notes.map((n, i) => formatNoteListItem(n, i)).join("\n");

      return success(
        `Notes: showing ${String(result.notes.length)} of ${String(result.meta.total)} notes\n\n${noteList}`
      );
    }
  }
}
