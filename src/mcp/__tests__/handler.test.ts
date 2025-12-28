/**
 * MCP Handler Tests
 *
 * Tests for tool handler routing using mocked domain clients
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NoteClient } from "../../notes/client.js";
import type { PageClient } from "../../pages/client.js";
import { NotePMAPIError } from "../../shared/errors.js";
import {
  createMockNote,
  createMockNotesResponse,
  createMockPage,
  createMockPagesResponse,
  createMockTag,
  createMockTagsResponse,
} from "../../shared/__tests__/fixtures.js";
import type { TagClient } from "../../tags/client.js";
import { handleToolCall } from "../handler.js";

// ============================================================
// Helper Functions
// ============================================================

/**
 * Extract text content from CallToolResult
 */
function getTextContent(result: CallToolResult): string {
  const content = result.content[0];
  if (content.type !== "text") {
    throw new Error(`Expected text content, got ${content.type}`);
  }
  return content.text;
}

// ============================================================
// Mock Setup
// ============================================================

const createMockNoteClient = () => ({
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  archive: vi.fn(),
  unarchive: vi.fn(),
});

const createMockPageClient = () => ({
  search: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

const createMockTagClient = () => ({
  list: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
});

type MockNoteClient = ReturnType<typeof createMockNoteClient>;
type MockPageClient = ReturnType<typeof createMockPageClient>;
type MockTagClient = ReturnType<typeof createMockTagClient>;

describe("handleToolCall", () => {
  let mockNoteClient: MockNoteClient;
  let mockPageClient: MockPageClient;
  let mockTagClient: MockTagClient;
  let clients: { notes: NoteClient; pages: PageClient; tags: TagClient };

  beforeEach(() => {
    mockNoteClient = createMockNoteClient();
    mockPageClient = createMockPageClient();
    mockTagClient = createMockTagClient();
    clients = {
      notes: mockNoteClient as unknown as NoteClient,
      pages: mockPageClient as unknown as PageClient,
      tags: mockTagClient as unknown as TagClient,
    };
    vi.clearAllMocks();
  });

  // ============================================================
  // Error Handling Tests
  // ============================================================

  describe("error handling", () => {
    it("should return error for unknown tool", async () => {
      const result = await handleToolCall(clients, "unknown_tool", {});

      expect(result.isError).toBe(true);
      expect(getTextContent(result)).toBe("Unknown tool: unknown_tool");
    });

    it("should return input error for invalid arguments", async () => {
      const result = await handleToolCall(clients, "get_page", {});

      expect(result.isError).toBe(true);
      expect(getTextContent(result)).toContain("Input error:");
    });

    it("should return error for NotePMAPIError", async () => {
      mockPageClient.get.mockRejectedValue(
        new NotePMAPIError(404, "Not Found", "NotePM API Error: 404 Not Found")
      );

      const result = await handleToolCall(clients, "get_page", {
        page_code: "nonexistent",
      });

      expect(result.isError).toBe(true);
      expect(getTextContent(result)).toContain("NotePM API Error");
    });

    it("should throw unexpected errors", async () => {
      mockPageClient.get.mockRejectedValue(new Error("Unexpected error"));

      await expect(
        handleToolCall(clients, "get_page", { page_code: "test" })
      ).rejects.toThrow("Unexpected error");
    });
  });

  // ============================================================
  // Page Tools Tests
  // ============================================================

  describe("search_pages", () => {
    it("should return '0 pages' for empty results", async () => {
      mockPageClient.search.mockResolvedValue(createMockPagesResponse([]));

      const result = await handleToolCall(clients, "search_pages", {});

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Search results: 0 pages");
    });

    it("should format search results correctly", async () => {
      const pages = [
        createMockPage({ page_code: "p1", title: "First Page" }),
        createMockPage({ page_code: "p2", title: "Second Page" }),
      ];
      mockPageClient.search.mockResolvedValue(createMockPagesResponse(pages, 2));

      const result = await handleToolCall(clients, "search_pages", { query: "test" });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("showing 2 of 2 pages");
      expect(getTextContent(result)).toContain("**First Page**");
      expect(getTextContent(result)).toContain("**Second Page**");
    });
  });

  describe("get_page", () => {
    it("should format page with all fields", async () => {
      const page = createMockPage();
      mockPageClient.get.mockResolvedValue(page);

      const result = await handleToolCall(clients, "get_page", { page_code: "page123" });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("## Test Page");
      expect(getTextContent(result)).toContain("Page code: page123");
    });
  });

  // ============================================================
  // Note Tools Tests
  // ============================================================

  describe("list_notes", () => {
    it("should return 'No notes found.' for empty results", async () => {
      mockNoteClient.list.mockResolvedValue(createMockNotesResponse([]));

      const result = await handleToolCall(clients, "list_notes", {});

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("No notes found.");
    });

    it("should format notes list correctly", async () => {
      const notes = [
        createMockNote({ note_code: "n1", name: "First Note" }),
        createMockNote({ note_code: "n2", name: "Second Note" }),
      ];
      mockNoteClient.list.mockResolvedValue(createMockNotesResponse(notes, 2));

      const result = await handleToolCall(clients, "list_notes", {});

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("showing 2 of 2 notes");
      expect(getTextContent(result)).toContain("**First Note**");
    });
  });

  describe("get_note", () => {
    it("should format note with all fields", async () => {
      const note = createMockNote();
      mockNoteClient.get.mockResolvedValue(note);

      const result = await handleToolCall(clients, "get_note", { note_code: "note123" });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("## Test Note");
      expect(getTextContent(result)).toContain("Note code: note123");
    });
  });

  describe("archive_note", () => {
    it("should return success message", async () => {
      mockNoteClient.archive.mockResolvedValue(undefined);

      const result = await handleToolCall(clients, "archive_note", { note_code: "note123" });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Note archived: note123");
    });
  });

  describe("unarchive_note", () => {
    it("should return success message", async () => {
      mockNoteClient.unarchive.mockResolvedValue(undefined);

      const result = await handleToolCall(clients, "unarchive_note", { note_code: "note123" });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Note unarchived: note123");
    });
  });

  // ============================================================
  // Tag Tools Tests
  // ============================================================

  describe("list_tags", () => {
    it("should return '0 tags found' for empty results", async () => {
      mockTagClient.list.mockResolvedValue(createMockTagsResponse([]));

      const result = await handleToolCall(clients, "list_tags", {});

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Tags: 0 tags found");
    });

    it("should format tag list correctly", async () => {
      const tags = [{ name: "important" }, { name: "draft" }];
      mockTagClient.list.mockResolvedValue(createMockTagsResponse(tags, 2));

      const result = await handleToolCall(clients, "list_tags", {});

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("showing 2 of 2 tags");
      expect(getTextContent(result)).toContain("1. important");
    });
  });

  describe("create_tag", () => {
    it("should return success message", async () => {
      mockTagClient.create.mockResolvedValue(createMockTag({ name: "new-tag" }));

      const result = await handleToolCall(clients, "create_tag", { name: "new-tag" });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Tag created: new-tag");
    });
  });

  describe("delete_tag", () => {
    it("should return success message", async () => {
      mockTagClient.delete.mockResolvedValue(undefined);

      const result = await handleToolCall(clients, "delete_tag", { name: "tag-to-delete" });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Tag deleted: tag-to-delete");
    });
  });
});
