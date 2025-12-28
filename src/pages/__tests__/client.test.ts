/**
 * PageClient Tests
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HttpClient } from "../../shared/http-client.js";
import { PageClient } from "../client.js";

describe("PageClient", () => {
  let client: PageClient;
  let mockHttp: { request: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHttp = { request: vi.fn() };
    client = new PageClient(mockHttp as unknown as HttpClient);
  });

  describe("search", () => {
    it("should call GET /pages with no params", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search();

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/pages");
    });

    it("should include q param", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({ q: "test query" });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/pages?q=test+query"
      );
    });

    it("should include only_title param", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({ only_title: true });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/pages?only_title=1"
      );
    });

    it("should include include_archived param", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({ include_archived: true });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/pages?include_archived=1"
      );
    });

    it("should include note_code param", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({ note_code: "abc123" });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/pages?note_code=abc123"
      );
    });

    it("should include tag_name param", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({ tag_name: "important" });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/pages?tag_name=important"
      );
    });

    it("should include page param", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({ page: 2 });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/pages?page=2");
    });

    it("should include per_page param", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({ per_page: 50 });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/pages?per_page=50");
    });

    it("should include all params", async () => {
      mockHttp.request.mockResolvedValue({ pages: [], meta: {} });

      await client.search({
        q: "test",
        only_title: true,
        include_archived: true,
        note_code: "abc123",
        tag_name: "important",
        page: 2,
        per_page: 50,
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/pages?q=test&only_title=1&include_archived=1&note_code=abc123&tag_name=important&page=2&per_page=50"
      );
    });
  });

  describe("get", () => {
    it("should call GET /pages/:page_code and return page", async () => {
      const mockPage = { page_code: "abc123", title: "Test" };
      mockHttp.request.mockResolvedValue({ page: mockPage });

      const result = await client.get("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/pages/abc123");
      expect(result).toEqual(mockPage);
    });
  });

  describe("create", () => {
    it("should call POST /pages with params and return page", async () => {
      const mockPage = { page_code: "new123", title: "New Page" };
      mockHttp.request.mockResolvedValue({ page: mockPage });

      const params = { note_code: "note123", title: "New Page" };
      const result = await client.create(params);

      expect(mockHttp.request).toHaveBeenCalledWith("POST", "/pages", params);
      expect(result).toEqual(mockPage);
    });

    it("should include optional params", async () => {
      const mockPage = { page_code: "new123", title: "New Page" };
      mockHttp.request.mockResolvedValue({ page: mockPage });

      const params = {
        note_code: "note123",
        title: "New Page",
        body: "Content",
        memo: "Memo",
        tags: ["tag1", "tag2"],
      };
      const result = await client.create(params);

      expect(mockHttp.request).toHaveBeenCalledWith("POST", "/pages", params);
      expect(result).toEqual(mockPage);
    });
  });

  describe("update", () => {
    it("should call PATCH /pages/:page_code with params and return page", async () => {
      const mockPage = { page_code: "abc123", title: "Updated" };
      mockHttp.request.mockResolvedValue({ page: mockPage });

      const params = { title: "Updated" };
      const result = await client.update("abc123", params);

      expect(mockHttp.request).toHaveBeenCalledWith(
        "PATCH",
        "/pages/abc123",
        params
      );
      expect(result).toEqual(mockPage);
    });
  });

  describe("delete", () => {
    it("should call DELETE /pages/:page_code", async () => {
      mockHttp.request.mockResolvedValue(undefined);

      await client.delete("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith("DELETE", "/pages/abc123");
    });
  });
});
