/**
 * NoteClient Tests
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HttpClient } from "../../shared/http-client.js";
import { NoteClient } from "../client.js";

describe("NoteClient", () => {
  let client: NoteClient;
  let mockHttp: { request: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHttp = { request: vi.fn() };
    client = new NoteClient(mockHttp as unknown as HttpClient);
  });

  describe("list", () => {
    it("should call GET /notes with no params", async () => {
      mockHttp.request.mockResolvedValue({ notes: [], meta: {} });

      await client.list();

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/notes");
    });

    it("should include include_archived param", async () => {
      mockHttp.request.mockResolvedValue({ notes: [], meta: {} });

      await client.list({ include_archived: true });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/notes?include_archived=1"
      );
    });

    it("should include page param", async () => {
      mockHttp.request.mockResolvedValue({ notes: [], meta: {} });

      await client.list({ page: 2 });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/notes?page=2");
    });

    it("should include per_page param", async () => {
      mockHttp.request.mockResolvedValue({ notes: [], meta: {} });

      await client.list({ per_page: 50 });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/notes?per_page=50");
    });

    it("should include all params", async () => {
      mockHttp.request.mockResolvedValue({ notes: [], meta: {} });

      await client.list({ include_archived: true, page: 2, per_page: 50 });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/notes?include_archived=1&page=2&per_page=50"
      );
    });
  });

});
