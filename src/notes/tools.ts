/**
 * Note domain tool definitions
 */
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { toInputSchema } from "../shared/index.js";
import {
  ArchiveNoteInputSchema,
  CreateNoteInputSchema,
  DeleteNoteInputSchema,
  GetNoteInputSchema,
  ListNotesInputSchema,
  UnarchiveNoteInputSchema,
  UpdateNoteInputSchema,
} from "./schemas.js";
import { NOTE_TOOL_NAMES } from "./types.js";

export const NOTE_TOOLS: Tool[] = [
  {
    name: NOTE_TOOL_NAMES.LIST_NOTES,
    description: "List all NotePM notes. Returns note codes, names, and descriptions.",
    inputSchema: toInputSchema(ListNotesInputSchema),
  },
  {
    name: NOTE_TOOL_NAMES.GET_NOTE,
    description: "Get a NotePM note. Retrieve name, description, scope and other details by note code.",
    inputSchema: toInputSchema(GetNoteInputSchema),
  },
  {
    name: NOTE_TOOL_NAMES.CREATE_NOTE,
    description: "Create a new note in NotePM. Note name and scope are required.",
    inputSchema: toInputSchema(CreateNoteInputSchema),
  },
  {
    name: NOTE_TOOL_NAMES.UPDATE_NOTE,
    description: "Update an existing NotePM note. Note code is required.",
    inputSchema: toInputSchema(UpdateNoteInputSchema),
  },
  {
    name: NOTE_TOOL_NAMES.DELETE_NOTE,
    description: "Delete a NotePM note. This action cannot be undone. All pages within the note will also be deleted.",
    inputSchema: toInputSchema(DeleteNoteInputSchema),
  },
  {
    name: NOTE_TOOL_NAMES.ARCHIVE_NOTE,
    description: "Archive a NotePM note. Archived notes are hidden from the default list but can be restored.",
    inputSchema: toInputSchema(ArchiveNoteInputSchema),
  },
  {
    name: NOTE_TOOL_NAMES.UNARCHIVE_NOTE,
    description: "Unarchive a NotePM note. Restores an archived note back to the active notes list.",
    inputSchema: toInputSchema(UnarchiveNoteInputSchema),
  },
];
