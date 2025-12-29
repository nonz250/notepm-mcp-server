/**
 * TagClient Tests
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HttpClient } from "../../shared/http-client.js";
import { TagClient } from "../client.js";

describe("TagClient", () => {
  let client: TagClient;
  let mockHttp: { request: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHttp = { request: vi.fn() };
    client = new TagClient(mockHttp as unknown as HttpClient);
  });

  describe("list", () => {
    it("should call GET /tags with no params", async () => {
      mockHttp.request.mockResolvedValue({ tags: [], meta: {} });

      await client.list();

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/tags");
    });

    it("should include note_code param", async () => {
      mockHttp.request.mockResolvedValue({ tags: [], meta: {} });

      await client.list({ note_code: "abc123" });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/tags?note_code=abc123");
    });

    it("should include page param", async () => {
      mockHttp.request.mockResolvedValue({ tags: [], meta: {} });

      await client.list({ page: 2 });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/tags?page=2");
    });

    it("should include per_page param", async () => {
      mockHttp.request.mockResolvedValue({ tags: [], meta: {} });

      await client.list({ per_page: 100 });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/tags?per_page=100");
    });

    it("should include all params", async () => {
      mockHttp.request.mockResolvedValue({ tags: [], meta: {} });

      await client.list({ note_code: "abc123", page: 2, per_page: 100 });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/tags?note_code=abc123&page=2&per_page=100"
      );
    });
  });

  describe("create", () => {
    it("should call POST /tags with params and return tag", async () => {
      const mockTag = { name: "new-tag" };
      mockHttp.request.mockResolvedValue({ tag: mockTag });

      const params = { name: "new-tag" };
      const result = await client.create(params);

      expect(mockHttp.request).toHaveBeenCalledWith("POST", "/tags", params);
      expect(result).toEqual(mockTag);
    });
  });
});
