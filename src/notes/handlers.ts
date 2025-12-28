/**
 * Note domain handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { parseInput, success } from "../shared/result.js";
import { NoteClient } from "./client.js";
import {
  ArchiveNoteInputSchema,
  CreateNoteInputSchema,
  DeleteNoteInputSchema,
  GetNoteInputSchema,
  ListNotesInputSchema,
  UnarchiveNoteInputSchema,
  UpdateNoteInputSchema,
} from "./schemas.js";
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
 * Format note information
 */
function formatNote(note: Note): string {
  const scopeText = note.scope === 0 || note.scope === "open" ? "All members" : "Participating members only";
  return [
    `## ${note.name}`,
    `- Note code: ${note.note_code}`,
    `- Description: ${note.description || "(No description)"}`,
    `- Scope: ${scopeText}`,
    `- Archived: ${note.archived ? "Yes" : "No"}`,
    `- Created at: ${note.created_at ?? "N/A"}`,
    `- Updated at: ${note.updated_at ?? "N/A"}`,
  ].join("\n");
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

    case NOTE_TOOL_NAMES.GET_NOTE: {
      const { note_code } = parseInput(GetNoteInputSchema, args);
      const note = await client.get(note_code);
      return success(formatNote(note));
    }

    case NOTE_TOOL_NAMES.CREATE_NOTE: {
      const { name, description, scope, groups, users } = parseInput(CreateNoteInputSchema, args);
      const note = await client.create({ name, description, scope, groups, users });
      return success(`Note created.\n\n${formatNote(note)}`);
    }

    case NOTE_TOOL_NAMES.UPDATE_NOTE: {
      const { note_code, name, description, scope, groups, users } = parseInput(UpdateNoteInputSchema, args);
      const note = await client.update(note_code, { name, description, scope, groups, users });
      return success(`Note updated.\n\n${formatNote(note)}`);
    }

    case NOTE_TOOL_NAMES.DELETE_NOTE: {
      const { note_code } = parseInput(DeleteNoteInputSchema, args);
      await client.delete(note_code);
      return success(`Note deleted: ${note_code}`);
    }

    case NOTE_TOOL_NAMES.ARCHIVE_NOTE: {
      const { note_code } = parseInput(ArchiveNoteInputSchema, args);
      await client.archive(note_code);
      return success(`Note archived: ${note_code}`);
    }

    case NOTE_TOOL_NAMES.UNARCHIVE_NOTE: {
      const { note_code } = parseInput(UnarchiveNoteInputSchema, args);
      await client.unarchive(note_code);
      return success(`Note unarchived: ${note_code}`);
    }
  }
}
