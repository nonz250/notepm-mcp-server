/**
 * Tool Handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { Note, NotePMAPIError, NotePMClient, Page } from "../notepm-client.js";
import { TOOL_NAMES, ToolName } from "./constants.js";
import {
  ArchiveNoteInputSchema,
  CreateNoteInputSchema,
  CreatePageInputSchema,
  CreateTagInputSchema,
  DeleteNoteInputSchema,
  DeletePageInputSchema,
  DeleteTagInputSchema,
  GetNoteInputSchema,
  GetPageInputSchema,
  ListNotesInputSchema,
  ListTagsInputSchema,
  SearchPagesInputSchema,
  UpdateNoteInputSchema,
  UpdatePageInputSchema,
} from "./schemas.js";

// ============================================================
// Types and Helpers
// ============================================================

/**
 * Create a successful tool result
 */
function success(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

/**
 * Create an error tool result
 */
function error(text: string): CallToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

/**
 * Input validation error
 */
class InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}

/**
 * Parse and validate input, throw InputError on failure
 */
function parseInput<T extends z.ZodType>(schema: T, args: unknown): z.infer<T> {
  const result = schema.safeParse(args);
  if (!result.success) {
    throw new InputError(result.error.message);
  }
  return result.data;
}

/**
 * Format page information
 */
function formatPage(page: Page): string {
  const tags = page.tags.map((t) => t.name).join(", ") || "None";
  return [
    `## ${page.title}`,
    `- Page code: ${page.page_code}`,
    `- Note code: ${page.note_code}`,
    `- Created by: ${page.created_by.name}`,
    `- Created at: ${page.created_at}`,
    `- Updated at: ${page.updated_at}`,
    `- Tags: ${tags}`,
    "",
    "### Body",
    page.body || "(No body)",
  ].join("\n");
}

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

// ============================================================
// Main Handler
// ============================================================

/**
 * Execute tool
 */
export async function handleToolCall(
  client: NotePMClient,
  name: string,
  args: unknown
): Promise<CallToolResult> {
  try {
    switch (name as ToolName) {
      case TOOL_NAMES.SEARCH_PAGES: {
        const { query, note_code, tag_name, page, per_page } = parseInput(
          SearchPagesInputSchema,
          args
        );
        const result = await client.searchPages({ q: query, note_code, tag_name, page, per_page });

        if (result.pages.length === 0) {
          return success("Search results: 0 pages");
        }

        const pageList = result.pages
          .map(
            (p, i) =>
              `${String(i + 1)}. **${p.title}** (code: ${p.page_code})\n   - Note: ${p.note_code} | Updated: ${p.updated_at}`
          )
          .join("\n");

        return success(
          `Search results: showing ${String(result.pages.length)} of ${String(result.meta.total)} pages\n\n${pageList}`
        );
      }

      case TOOL_NAMES.GET_PAGE: {
        const { page_code } = parseInput(GetPageInputSchema, args);
        const page = await client.getPage(page_code);
        return success(formatPage(page));
      }

      case TOOL_NAMES.CREATE_PAGE: {
        const { note_code, title, body, memo, tags } = parseInput(CreatePageInputSchema, args);
        const page = await client.createPage({ note_code, title, body, memo, tags });
        return success(`Page created.\n\n${formatPage(page)}`);
      }

      case TOOL_NAMES.UPDATE_PAGE: {
        const { page_code, title, body, memo, tags } = parseInput(UpdatePageInputSchema, args);
        const page = await client.updatePage(page_code, { title, body, memo, tags });
        return success(`Page updated.\n\n${formatPage(page)}`);
      }

      case TOOL_NAMES.DELETE_PAGE: {
        const { page_code } = parseInput(DeletePageInputSchema, args);
        await client.deletePage(page_code);
        return success(`Page deleted: ${page_code}`);
      }

      case TOOL_NAMES.LIST_NOTES: {
        const { include_archived, page, per_page } = parseInput(ListNotesInputSchema, args);
        const result = await client.listNotes({ include_archived, page, per_page });

        if (result.notes.length === 0) {
          return success("No notes found.");
        }

        const noteList = result.notes.map((n, i) => formatNoteListItem(n, i)).join("\n");

        return success(
          `Notes: showing ${String(result.notes.length)} of ${String(result.meta.total)} notes\n\n${noteList}`
        );
      }

      case TOOL_NAMES.GET_NOTE: {
        const { note_code } = parseInput(GetNoteInputSchema, args);
        const note = await client.getNote(note_code);
        return success(formatNote(note));
      }

      case TOOL_NAMES.CREATE_NOTE: {
        const { name, description, scope, groups, users } = parseInput(
          CreateNoteInputSchema,
          args
        );
        const note = await client.createNote({ name, description, scope, groups, users });
        return success(`Note created.\n\n${formatNote(note)}`);
      }

      case TOOL_NAMES.UPDATE_NOTE: {
        const { note_code, name, description, scope, groups, users } = parseInput(
          UpdateNoteInputSchema,
          args
        );
        const note = await client.updateNote(note_code, { name, description, scope, groups, users });
        return success(`Note updated.\n\n${formatNote(note)}`);
      }

      case TOOL_NAMES.DELETE_NOTE: {
        const { note_code } = parseInput(DeleteNoteInputSchema, args);
        await client.deleteNote(note_code);
        return success(`Note deleted: ${note_code}`);
      }

      case TOOL_NAMES.ARCHIVE_NOTE: {
        const { note_code } = parseInput(ArchiveNoteInputSchema, args);
        await client.archiveNote(note_code);
        return success(`Note archived: ${note_code}`);
      }

      case TOOL_NAMES.LIST_TAGS: {
        const { note_code, page, per_page } = parseInput(ListTagsInputSchema, args);
        const result = await client.listTags({ note_code, page, per_page });

        if (result.tags.length === 0) {
          return success("Tags: 0 tags found");
        }

        const tagList = result.tags.map((t, i) => `${String(i + 1)}. ${t.name}`).join("\n");

        return success(
          `Tags: showing ${String(result.tags.length)} of ${String(result.meta.total)} tags\n\n${tagList}`
        );
      }

      case TOOL_NAMES.CREATE_TAG: {
        const { name } = parseInput(CreateTagInputSchema, args);
        const tag = await client.createTag({ name });
        return success(`Tag created: ${tag.name}`);
      }

      case TOOL_NAMES.DELETE_TAG: {
        const { name } = parseInput(DeleteTagInputSchema, args);
        await client.deleteTag({ name });
        return success(`Tag deleted: ${name}`);
      }

      default:
        return error(`Unknown tool: ${name}`);
    }
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
