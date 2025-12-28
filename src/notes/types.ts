/**
 * Note domain types
 */

/** Note information */
export interface Note {
  note_code: string;
  name: string;
  description: string;
  scope: "open" | "private" | number;
  icon_url: string | null;
  archived: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Single note response */
export interface NoteResponse {
  note: Note;
}

/** Notes list response */
export interface NotesResponse {
  notes: Note[];
  meta: {
    previous_page: string | null;
    next_page: string | null;
    page: number;
    per_page: number;
    total: number;
  };
}

/** List notes parameters */
export interface ListNotesParams {
  include_archived?: boolean;
  page?: number;
  per_page?: number;
}

/** Create note parameters */
export interface CreateNoteParams {
  name: string;
  description?: string;
  scope: "open" | "private";
  groups?: string[];
  users?: string[];
}

/** Update note parameters */
export interface UpdateNoteParams {
  name?: string;
  description?: string;
  scope?: "open" | "private";
  groups?: string[];
  users?: string[];
}

/** Tool name constants for notes */
export const NOTE_TOOL_NAMES = {
  LIST_NOTES: "list_notes",
  GET_NOTE: "get_note",
  CREATE_NOTE: "create_note",
  UPDATE_NOTE: "update_note",
} as const;

/** Type representing valid note tool names */
export type NoteToolName = (typeof NOTE_TOOL_NAMES)[keyof typeof NOTE_TOOL_NAMES];
