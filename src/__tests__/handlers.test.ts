/**
 * Handler Tests
 *
 * Tests for tool handlers using mocked NotePMClient
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotePMAPIError, NotePMClient } from "../notepm-client.js";
import { handleToolCall } from "../tools/handlers.js";
import {
  createMockNote,
  createMockNotesResponse,
  createMockPage,
  createMockPagesResponse,
} from "./fixtures.js";

// ============================================================
// Helper Functions
// ============================================================

/**
 * Extract text content from CallToolResult
 * Throws if the first content item is not a text type
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

const createMockClient = () => ({
  searchPages: vi.fn(),
  getPage: vi.fn(),
  createPage: vi.fn(),
  updatePage: vi.fn(),
  deletePage: vi.fn(),
  listNotes: vi.fn(),
  createNote: vi.fn(),
  updateNote: vi.fn(),
});

type MockClient = ReturnType<typeof createMockClient>;

describe("handleToolCall", () => {
  let mockClient: MockClient;

  beforeEach(() => {
    mockClient = createMockClient();
    vi.clearAllMocks();
  });

  // ============================================================
  // Error Handling Tests
  // ============================================================

  describe("error handling", () => {
    it("should return error for unknown tool", async () => {
      const result = await handleToolCall(
        mockClient as unknown as NotePMClient,
        "unknown_tool",
        {}
      );

      expect(result.isError).toBe(true);
      expect(getTextContent(result)).toBe("Unknown tool: unknown_tool");
    });

    it("should return input error for invalid arguments", async () => {
      const result = await handleToolCall(
        mockClient as unknown as NotePMClient,
        "get_page",
        {} // missing required page_code
      );

      expect(result.isError).toBe(true);
      expect(getTextContent(result)).toContain("Input error:");
    });

    it("should return error for NotePMAPIError", async () => {
      mockClient.getPage.mockRejectedValue(
        new NotePMAPIError(404, "Not Found", "NotePM API Error: 404 Not Found")
      );

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "get_page", {
        page_code: "nonexistent",
      });

      expect(result.isError).toBe(true);
      expect(getTextContent(result)).toContain("NotePM API Error");
    });

    it("should throw unexpected errors", async () => {
      mockClient.getPage.mockRejectedValue(new Error("Unexpected error"));

      await expect(
        handleToolCall(mockClient as unknown as NotePMClient, "get_page", {
          page_code: "test",
        })
      ).rejects.toThrow("Unexpected error");
    });
  });

  // ============================================================
  // search_pages Tests
  // ============================================================

  describe("search_pages", () => {
    it("should return '0 pages' for empty results", async () => {
      mockClient.searchPages.mockResolvedValue(createMockPagesResponse([]));

      const result = await handleToolCall(
        mockClient as unknown as NotePMClient,
        "search_pages",
        {}
      );

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Search results: 0 pages");
    });

    it("should format search results correctly", async () => {
      const pages = [
        createMockPage({ page_code: "p1", title: "First Page" }),
        createMockPage({ page_code: "p2", title: "Second Page" }),
      ];
      mockClient.searchPages.mockResolvedValue(createMockPagesResponse(pages, 2));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "search_pages", {
        query: "test",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("showing 2 of 2 pages");
      expect(getTextContent(result)).toContain("**First Page**");
      expect(getTextContent(result)).toContain("**Second Page**");
      expect(getTextContent(result)).toContain("code: p1");
      expect(getTextContent(result)).toContain("code: p2");
    });

    it("should show correct count when more pages exist", async () => {
      const pages = [createMockPage()];
      mockClient.searchPages.mockResolvedValue(createMockPagesResponse(pages, 100));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "search_pages", {
        per_page: 1,
      });

      expect(getTextContent(result)).toContain("showing 1 of 100 pages");
    });

    it("should pass all search parameters to client", async () => {
      mockClient.searchPages.mockResolvedValue(createMockPagesResponse([]));

      await handleToolCall(mockClient as unknown as NotePMClient, "search_pages", {
        query: "test query",
        note_code: "note123",
        tag_name: "important",
        page: 2,
        per_page: 50,
      });

      expect(mockClient.searchPages).toHaveBeenCalledWith({
        q: "test query",
        note_code: "note123",
        tag_name: "important",
        page: 2,
        per_page: 50,
      });
    });
  });

  // ============================================================
  // get_page Tests
  // ============================================================

  describe("get_page", () => {
    it("should format page with all fields", async () => {
      const page = createMockPage();
      mockClient.getPage.mockResolvedValue(page);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "get_page", {
        page_code: "page123",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("## Test Page");
      expect(getTextContent(result)).toContain("Page code: page123");
      expect(getTextContent(result)).toContain("Note code: note456");
      expect(getTextContent(result)).toContain("Created by: Test User");
      expect(getTextContent(result)).toContain("Tags: tag1, tag2");
      expect(getTextContent(result)).toContain("Test body content");
    });

    it("should show 'None' for empty tags", async () => {
      const page = createMockPage({ tags: [] });
      mockClient.getPage.mockResolvedValue(page);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "get_page", {
        page_code: "page123",
      });

      expect(getTextContent(result)).toContain("Tags: None");
    });

    it("should show '(No body)' for empty body", async () => {
      const page = createMockPage({ body: "" });
      mockClient.getPage.mockResolvedValue(page);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "get_page", {
        page_code: "page123",
      });

      expect(getTextContent(result)).toContain("(No body)");
    });

    it("should call client with correct page_code", async () => {
      mockClient.getPage.mockResolvedValue(createMockPage());

      await handleToolCall(mockClient as unknown as NotePMClient, "get_page", {
        page_code: "specific_code",
      });

      expect(mockClient.getPage).toHaveBeenCalledWith("specific_code");
    });
  });

  // ============================================================
  // create_page Tests
  // ============================================================

  describe("create_page", () => {
    it("should return success message with formatted page", async () => {
      const page = createMockPage({ title: "New Page" });
      mockClient.createPage.mockResolvedValue(page);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "create_page", {
        note_code: "note123",
        title: "New Page",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("Page created.");
      expect(getTextContent(result)).toContain("## New Page");
    });

    it("should pass all parameters to client", async () => {
      mockClient.createPage.mockResolvedValue(createMockPage());

      await handleToolCall(mockClient as unknown as NotePMClient, "create_page", {
        note_code: "note123",
        title: "Test",
        body: "Body content",
        memo: "Memo text",
        tags: ["tag1", "tag2"],
      });

      expect(mockClient.createPage).toHaveBeenCalledWith({
        note_code: "note123",
        title: "Test",
        body: "Body content",
        memo: "Memo text",
        tags: ["tag1", "tag2"],
      });
    });

    it("should handle optional parameters", async () => {
      mockClient.createPage.mockResolvedValue(createMockPage());

      await handleToolCall(mockClient as unknown as NotePMClient, "create_page", {
        note_code: "note123",
        title: "Minimal Page",
      });

      expect(mockClient.createPage).toHaveBeenCalledWith({
        note_code: "note123",
        title: "Minimal Page",
        body: undefined,
        memo: undefined,
        tags: undefined,
      });
    });
  });

  // ============================================================
  // update_page Tests
  // ============================================================

  describe("update_page", () => {
    it("should return success message with formatted page", async () => {
      const page = createMockPage({ title: "Updated Page" });
      mockClient.updatePage.mockResolvedValue(page);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "update_page", {
        page_code: "page123",
        title: "Updated Page",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("Page updated.");
      expect(getTextContent(result)).toContain("## Updated Page");
    });

    it("should pass page_code and update params to client", async () => {
      mockClient.updatePage.mockResolvedValue(createMockPage());

      await handleToolCall(mockClient as unknown as NotePMClient, "update_page", {
        page_code: "page123",
        title: "New Title",
        body: "New Body",
        memo: "New Memo",
        tags: ["newtag"],
      });

      expect(mockClient.updatePage).toHaveBeenCalledWith("page123", {
        title: "New Title",
        body: "New Body",
        memo: "New Memo",
        tags: ["newtag"],
      });
    });

    it("should allow partial updates", async () => {
      mockClient.updatePage.mockResolvedValue(createMockPage());

      await handleToolCall(mockClient as unknown as NotePMClient, "update_page", {
        page_code: "page123",
        title: "Only Title Changed",
      });

      expect(mockClient.updatePage).toHaveBeenCalledWith("page123", {
        title: "Only Title Changed",
        body: undefined,
        memo: undefined,
        tags: undefined,
      });
    });
  });

  // ============================================================
  // delete_page Tests
  // ============================================================

  describe("delete_page", () => {
    it("should return success message with page_code", async () => {
      mockClient.deletePage.mockResolvedValue(undefined);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "delete_page", {
        page_code: "page123",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("Page deleted: page123");
    });

    it("should call client with correct page_code", async () => {
      mockClient.deletePage.mockResolvedValue(undefined);

      await handleToolCall(mockClient as unknown as NotePMClient, "delete_page", {
        page_code: "delete_me",
      });

      expect(mockClient.deletePage).toHaveBeenCalledWith("delete_me");
    });
  });

  // ============================================================
  // list_notes Tests
  // ============================================================

  describe("list_notes", () => {
    it("should return 'No notes found.' for empty results", async () => {
      mockClient.listNotes.mockResolvedValue(createMockNotesResponse([]));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "list_notes", {});

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toBe("No notes found.");
    });

    it("should format notes list correctly", async () => {
      const notes = [
        createMockNote({ note_code: "n1", name: "First Note", description: "Desc 1" }),
        createMockNote({ note_code: "n2", name: "Second Note", description: "Desc 2" }),
      ];
      mockClient.listNotes.mockResolvedValue(createMockNotesResponse(notes, 2));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "list_notes", {});

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("showing 2 of 2 notes");
      expect(getTextContent(result)).toContain("**First Note**");
      expect(getTextContent(result)).toContain("**Second Note**");
      expect(getTextContent(result)).toContain("code: n1");
      expect(getTextContent(result)).toContain("code: n2");
    });

    it("should show archived status", async () => {
      const notes = [createMockNote({ archived: true })];
      mockClient.listNotes.mockResolvedValue(createMockNotesResponse(notes));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "list_notes", {});

      expect(getTextContent(result)).toContain("[archived]");
    });

    it("should show private scope", async () => {
      const notes = [createMockNote({ scope: "private" })];
      mockClient.listNotes.mockResolvedValue(createMockNotesResponse(notes));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "list_notes", {});

      expect(getTextContent(result)).toContain("(private)");
    });

    it("should show '(No description)' for empty description", async () => {
      const notes = [createMockNote({ description: "" })];
      mockClient.listNotes.mockResolvedValue(createMockNotesResponse(notes));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "list_notes", {});

      expect(getTextContent(result)).toContain("(No description)");
    });

    it("should pass parameters to client", async () => {
      mockClient.listNotes.mockResolvedValue(createMockNotesResponse([]));

      await handleToolCall(mockClient as unknown as NotePMClient, "list_notes", {
        include_archived: true,
        page: 3,
        per_page: 50,
      });

      expect(mockClient.listNotes).toHaveBeenCalledWith({
        include_archived: true,
        page: 3,
        per_page: 50,
      });
    });

    it("should show correct count when more notes exist", async () => {
      const notes = [createMockNote()];
      mockClient.listNotes.mockResolvedValue(createMockNotesResponse(notes, 100));

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "list_notes", {
        per_page: 1,
      });

      expect(getTextContent(result)).toContain("showing 1 of 100 notes");
    });
  });

  // ============================================================
  // create_note Tests
  // ============================================================

  describe("create_note", () => {
    it("should return success message with formatted note", async () => {
      const note = createMockNote({ name: "New Note" });
      mockClient.createNote.mockResolvedValue(note);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "create_note", {
        name: "New Note",
        scope: "open",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("Note created.");
      expect(getTextContent(result)).toContain("## New Note");
    });

    it("should format note with all fields", async () => {
      const note = createMockNote();
      mockClient.createNote.mockResolvedValue(note);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "create_note", {
        name: "Test Note",
        scope: "open",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("Note code: note123");
      expect(getTextContent(result)).toContain("Description: Test description");
      expect(getTextContent(result)).toContain("Scope: All members");
      expect(getTextContent(result)).toContain("Archived: No");
    });

    it("should show correct scope for participating members only", async () => {
      const note = createMockNote({ scope: "private" });
      mockClient.createNote.mockResolvedValue(note);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "create_note", {
        name: "Private Note",
        scope: "private",
      });

      expect(getTextContent(result)).toContain("Scope: Participating members only");
    });

    it("should show '(No description)' for empty description", async () => {
      const note = createMockNote({ description: "" });
      mockClient.createNote.mockResolvedValue(note);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "create_note", {
        name: "No Description Note",
        scope: "open",
      });

      expect(getTextContent(result)).toContain("Description: (No description)");
    });

    it("should pass all parameters to client", async () => {
      mockClient.createNote.mockResolvedValue(createMockNote());

      await handleToolCall(mockClient as unknown as NotePMClient, "create_note", {
        name: "Full Note",
        description: "A detailed description",
        scope: "private",
        groups: ["group1", "group2"],
        users: ["user1"],
      });

      expect(mockClient.createNote).toHaveBeenCalledWith({
        name: "Full Note",
        description: "A detailed description",
        scope: "private",
        groups: ["group1", "group2"],
        users: ["user1"],
      });
    });

    it("should handle minimal parameters (name and scope only)", async () => {
      mockClient.createNote.mockResolvedValue(createMockNote());

      await handleToolCall(mockClient as unknown as NotePMClient, "create_note", {
        name: "Minimal Note",
        scope: "open",
      });

      expect(mockClient.createNote).toHaveBeenCalledWith({
        name: "Minimal Note",
        description: undefined,
        scope: "open",
        groups: undefined,
        users: undefined,
      });
    });
  });

  // ============================================================
  // update_note Tests
  // ============================================================

  describe("update_note", () => {
    it("should return success message with formatted note", async () => {
      const note = createMockNote({ name: "Updated Note" });
      mockClient.updateNote.mockResolvedValue(note);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "update_note", {
        note_code: "note123",
        name: "Updated Note",
      });

      expect(result.isError).toBeUndefined();
      expect(getTextContent(result)).toContain("Note updated.");
      expect(getTextContent(result)).toContain("## Updated Note");
    });

    it("should pass note_code and update params to client", async () => {
      mockClient.updateNote.mockResolvedValue(createMockNote());

      await handleToolCall(mockClient as unknown as NotePMClient, "update_note", {
        note_code: "note123",
        name: "New Name",
        description: "New Description",
        scope: "private",
        groups: ["group1"],
        users: ["user1"],
      });

      expect(mockClient.updateNote).toHaveBeenCalledWith("note123", {
        name: "New Name",
        description: "New Description",
        scope: "private",
        groups: ["group1"],
        users: ["user1"],
      });
    });

    it("should allow partial updates", async () => {
      mockClient.updateNote.mockResolvedValue(createMockNote());

      await handleToolCall(mockClient as unknown as NotePMClient, "update_note", {
        note_code: "note123",
        name: "Only Name Changed",
      });

      expect(mockClient.updateNote).toHaveBeenCalledWith("note123", {
        name: "Only Name Changed",
        description: undefined,
        scope: undefined,
        groups: undefined,
        users: undefined,
      });
    });

    it("should show '(No description)' for empty description", async () => {
      const note = createMockNote({ description: "" });
      mockClient.updateNote.mockResolvedValue(note);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "update_note", {
        note_code: "note123",
      });

      expect(getTextContent(result)).toContain("(No description)");
    });

    it("should format note with all fields", async () => {
      const note = createMockNote();
      mockClient.updateNote.mockResolvedValue(note);

      const result = await handleToolCall(mockClient as unknown as NotePMClient, "update_note", {
        note_code: "note123",
      });

      expect(getTextContent(result)).toContain("## Test Note");
      expect(getTextContent(result)).toContain("Note code: note123");
      expect(getTextContent(result)).toContain("Scope: All members");
      expect(getTextContent(result)).toContain("Test description");
    });
  });
});
