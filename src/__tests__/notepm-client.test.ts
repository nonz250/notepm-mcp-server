/**
 * NotePM Client Tests
 *
 * Tests for NotePMClient using fetch mocking
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NotePMAPIError, NotePMClient } from "../notepm-client.js";
import {
  createMockPage,
  createMockPagesResponse,
  createMockTag,
  createMockTagsResponse,
} from "./fixtures.js";

// ============================================================
// Test Configuration
// ============================================================

const TEST_CONFIG = {
  teamDomain: "testteam",
  accessToken: "test-token-123",
  baseUrl: "https://testteam.notepm.jp/api/v1",
};

// ============================================================
// Mock Setup
// ============================================================

const mockFetch = vi.fn();

describe("NotePMClient", () => {
  let client: NotePMClient;

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    client = new NotePMClient(TEST_CONFIG);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ============================================================
  // Helper to create mock Response
  // ============================================================

  const mockResponse = (data: unknown, status = 200, statusText = "OK") => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  };

  const mockErrorResponse = (status: number, statusText: string, errorBody: string) => {
    return Promise.resolve({
      ok: false,
      status,
      statusText,
      json: () => Promise.resolve({ error: errorBody }),
      text: () => Promise.resolve(errorBody),
    });
  };

  // ============================================================
  // Request Verification Helper
  // ============================================================

  interface FetchOptions {
    method: string;
    headers: Record<string, string>;
    body?: string;
  }

  const expectFetchCalledWith = (method: string, path: string, body?: unknown) => {
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, FetchOptions];
    expect(url).toBe(`${TEST_CONFIG.baseUrl}${path}`);
    expect(options.method).toBe(method);
    expect(options.headers.Authorization).toBe(`Bearer ${TEST_CONFIG.accessToken}`);
    expect(options.headers["Content-Type"]).toBe("application/json");
    if (body) {
      expect(JSON.parse(options.body ?? "{}")).toEqual(body);
    }
  };

  // ============================================================
  // searchPages Tests
  // ============================================================

  describe("searchPages", () => {
    it("should call GET /pages without params", async () => {
      mockFetch.mockReturnValue(mockResponse(createMockPagesResponse([])));

      await client.searchPages();

      expectFetchCalledWith("GET", "/pages");
    });

    it("should call GET /pages with query params", async () => {
      mockFetch.mockReturnValue(mockResponse(createMockPagesResponse([])));

      await client.searchPages({
        q: "search term",
        note_code: "note123",
        tag_name: "important",
        per_page: 50,
        page: 2,
      });

      const [url] = mockFetch.mock.calls[0] as [string, FetchOptions];
      expect(url).toContain("/pages?");
      expect(url).toContain("q=search+term");
      expect(url).toContain("note_code=note123");
      expect(url).toContain("tag_name=important");
      expect(url).toContain("per_page=50");
      expect(url).toContain("page=2");
    });

    it("should return pages response", async () => {
      const pages = [createMockPage(), createMockPage({ page_code: "page2" })];
      mockFetch.mockReturnValue(mockResponse(createMockPagesResponse(pages, 100)));

      const result = await client.searchPages({ q: "test" });

      expect(result.pages).toHaveLength(2);
      expect(result.meta.total).toBe(100);
    });

    it("should include only_title param when true", async () => {
      mockFetch.mockReturnValue(mockResponse(createMockPagesResponse([])));

      await client.searchPages({ only_title: true });

      const [url] = mockFetch.mock.calls[0] as [string, FetchOptions];
      expect(url).toContain("only_title=true");
    });

    it("should include include_archived param when true", async () => {
      mockFetch.mockReturnValue(mockResponse(createMockPagesResponse([])));

      await client.searchPages({ include_archived: true });

      const [url] = mockFetch.mock.calls[0] as [string, FetchOptions];
      expect(url).toContain("include_archived=true");
    });
  });

  // ============================================================
  // getPage Tests
  // ============================================================

  describe("getPage", () => {
    it("should call GET /pages/:page_code", async () => {
      const page = createMockPage();
      mockFetch.mockReturnValue(mockResponse({ page }));

      await client.getPage("page123");

      expectFetchCalledWith("GET", "/pages/page123");
    });

    it("should return page object", async () => {
      const page = createMockPage({ title: "My Page" });
      mockFetch.mockReturnValue(mockResponse({ page }));

      const result = await client.getPage("page123");

      expect(result.title).toBe("My Page");
      expect(result.page_code).toBe("page123");
    });

    it("should handle special characters in page_code", async () => {
      const page = createMockPage();
      mockFetch.mockReturnValue(mockResponse({ page }));

      await client.getPage("page-with-dash");

      expectFetchCalledWith("GET", "/pages/page-with-dash");
    });
  });

  // ============================================================
  // createPage Tests
  // ============================================================

  describe("createPage", () => {
    it("should call POST /pages with required params", async () => {
      const page = createMockPage();
      mockFetch.mockReturnValue(mockResponse({ page }));

      await client.createPage({
        note_code: "note123",
        title: "New Page",
      });

      expectFetchCalledWith("POST", "/pages", {
        note_code: "note123",
        title: "New Page",
      });
    });

    it("should call POST /pages with all params", async () => {
      const page = createMockPage();
      mockFetch.mockReturnValue(mockResponse({ page }));

      await client.createPage({
        note_code: "note123",
        title: "New Page",
        body: "Page content",
        memo: "Page memo",
        folder_id: 42,
        tags: ["tag1", "tag2"],
      });

      expectFetchCalledWith("POST", "/pages", {
        note_code: "note123",
        title: "New Page",
        body: "Page content",
        memo: "Page memo",
        folder_id: 42,
        tags: ["tag1", "tag2"],
      });
    });

    it("should return created page", async () => {
      const page = createMockPage({ title: "Created Page" });
      mockFetch.mockReturnValue(mockResponse({ page }));

      const result = await client.createPage({
        note_code: "note123",
        title: "Created Page",
      });

      expect(result.title).toBe("Created Page");
    });
  });

  // ============================================================
  // updatePage Tests
  // ============================================================

  describe("updatePage", () => {
    it("should call PATCH /pages/:page_code", async () => {
      const page = createMockPage();
      mockFetch.mockReturnValue(mockResponse({ page }));

      await client.updatePage("page123", { title: "Updated Title" });

      expectFetchCalledWith("PATCH", "/pages/page123", { title: "Updated Title" });
    });

    it("should send partial update", async () => {
      const page = createMockPage();
      mockFetch.mockReturnValue(mockResponse({ page }));

      await client.updatePage("page123", {
        body: "Updated body only",
      });

      expectFetchCalledWith("PATCH", "/pages/page123", { body: "Updated body only" });
    });

    it("should send all update fields", async () => {
      const page = createMockPage();
      mockFetch.mockReturnValue(mockResponse({ page }));

      await client.updatePage("page123", {
        title: "New Title",
        body: "New Body",
        memo: "New Memo",
        tags: ["newtag"],
      });

      expectFetchCalledWith("PATCH", "/pages/page123", {
        title: "New Title",
        body: "New Body",
        memo: "New Memo",
        tags: ["newtag"],
      });
    });

    it("should return updated page", async () => {
      const page = createMockPage({ title: "Updated Page" });
      mockFetch.mockReturnValue(mockResponse({ page }));

      const result = await client.updatePage("page123", { title: "Updated Page" });

      expect(result.title).toBe("Updated Page");
    });
  });

  // ============================================================
  // deletePage Tests
  // ============================================================

  describe("deletePage", () => {
    it("should call DELETE /pages/:page_code", async () => {
      mockFetch.mockReturnValue(
        Promise.resolve({
          ok: true,
          status: 204,
          statusText: "No Content",
          json: () => Promise.resolve({}),
          text: () => Promise.resolve(""),
        })
      );

      await client.deletePage("page123");

      expectFetchCalledWith("DELETE", "/pages/page123");
    });

    it("should handle 204 No Content response", async () => {
      mockFetch.mockReturnValue(
        Promise.resolve({
          ok: true,
          status: 204,
          statusText: "No Content",
          json: () => Promise.resolve({}),
          text: () => Promise.resolve(""),
        })
      );

      // Should not throw
      await expect(client.deletePage("page123")).resolves.toBeUndefined();
    });
  });

  // ============================================================
  // getTags Tests
  // ============================================================

  describe("getTags", () => {
    it("should call GET /tags without params", async () => {
      mockFetch.mockReturnValue(mockResponse(createMockTagsResponse([])));

      await client.getTags();

      expectFetchCalledWith("GET", "/tags");
    });

    it("should call GET /tags with pagination params", async () => {
      mockFetch.mockReturnValue(mockResponse(createMockTagsResponse([])));

      await client.getTags({
        per_page: 50,
        page: 2,
      });

      const [url] = mockFetch.mock.calls[0] as [string, FetchOptions];
      expect(url).toContain("/tags?");
      expect(url).toContain("per_page=50");
      expect(url).toContain("page=2");
    });

    it("should return tags response", async () => {
      const tags = [createMockTag({ name: "tag1" }), createMockTag({ name: "tag2" })];
      mockFetch.mockReturnValue(mockResponse(createMockTagsResponse(tags, 100)));

      const result = await client.getTags();

      expect(result.tags).toHaveLength(2);
      expect(result.tags[0].name).toBe("tag1");
      expect(result.tags[1].name).toBe("tag2");
      expect(result.meta.total).toBe(100);
    });
  });

  // ============================================================
  // Error Handling Tests
  // ============================================================

  describe("error handling", () => {
    it("should throw NotePMAPIError on 404", async () => {
      mockFetch.mockReturnValue(mockErrorResponse(404, "Not Found", "Page not found"));

      await expect(client.getPage("nonexistent")).rejects.toThrow(NotePMAPIError);
    });

    it("should include status code in error", async () => {
      mockFetch.mockReturnValue(mockErrorResponse(404, "Not Found", "Page not found"));

      try {
        await client.getPage("nonexistent");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(NotePMAPIError);
        const apiError = err as NotePMAPIError;
        expect(apiError.statusCode).toBe(404);
        expect(apiError.statusText).toBe("Not Found");
      }
    });

    it("should throw NotePMAPIError on 401 Unauthorized", async () => {
      mockFetch.mockReturnValue(mockErrorResponse(401, "Unauthorized", "Invalid token"));

      await expect(client.searchPages()).rejects.toThrow(NotePMAPIError);
    });

    it("should throw NotePMAPIError on 500 Server Error", async () => {
      mockFetch.mockReturnValue(mockErrorResponse(500, "Internal Server Error", "Server error"));

      await expect(client.searchPages()).rejects.toThrow(NotePMAPIError);
    });

    it("should include error body in message", async () => {
      mockFetch.mockReturnValue(
        mockErrorResponse(400, "Bad Request", "Validation error: title is required")
      );

      try {
        await client.createPage({ note_code: "note123", title: "" });
        expect.fail("Should have thrown");
      } catch (err) {
        const apiError = err as NotePMAPIError;
        expect(apiError.message).toContain("Validation error: title is required");
      }
    });
  });

  // ============================================================
  // Authorization Header Tests
  // ============================================================

  describe("authorization", () => {
    it("should include Bearer token in all requests", async () => {
      mockFetch.mockReturnValue(mockResponse(createMockPagesResponse([])));

      await client.searchPages();

      const [, options] = mockFetch.mock.calls[0] as [string, FetchOptions];
      expect(options.headers.Authorization).toBe("Bearer test-token-123");
    });

    it("should use custom baseUrl from config", async () => {
      const customClient = new NotePMClient({
        teamDomain: "custom",
        accessToken: "token",
        baseUrl: "https://custom.example.com/api/v1",
      });
      mockFetch.mockReturnValue(mockResponse(createMockPagesResponse([])));

      await customClient.searchPages();

      const [url] = mockFetch.mock.calls[0] as [string, FetchOptions];
      expect(url).toContain("https://custom.example.com/api/v1");
    });
  });
});
