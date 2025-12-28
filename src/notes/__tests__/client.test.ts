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

  describe("get", () => {
    it("should call GET /notes/:note_code and return note", async () => {
      const mockNote = { note_code: "abc123", name: "Test" };
      mockHttp.request.mockResolvedValue({ note: mockNote });

      const result = await client.get("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/notes/abc123");
      expect(result).toEqual(mockNote);
    });
  });

  describe("create", () => {
    it("should call POST /notes with params and return note", async () => {
      const mockNote = { note_code: "new123", name: "New Note" };
      mockHttp.request.mockResolvedValue({ note: mockNote });

      const params = { name: "New Note", scope: "open" as const };
      const result = await client.create(params);

      expect(mockHttp.request).toHaveBeenCalledWith("POST", "/notes", params);
      expect(result).toEqual(mockNote);
    });
  });

  describe("update", () => {
    it("should call PATCH /notes/:note_code with params and return note", async () => {
      const mockNote = { note_code: "abc123", name: "Updated" };
      mockHttp.request.mockResolvedValue({ note: mockNote });

      const params = { name: "Updated" };
      const result = await client.update("abc123", params);

      expect(mockHttp.request).toHaveBeenCalledWith(
        "PATCH",
        "/notes/abc123",
        params
      );
      expect(result).toEqual(mockNote);
    });
  });

  describe("delete", () => {
    it("should call DELETE /notes/:note_code", async () => {
      mockHttp.request.mockResolvedValue(undefined);

      await client.delete("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith("DELETE", "/notes/abc123");
    });
  });

  describe("archive", () => {
    it("should call PATCH /notes/:note_code/archive", async () => {
      mockHttp.request.mockResolvedValue(undefined);

      await client.archive("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith(
        "PATCH",
        "/notes/abc123/archive"
      );
    });
  });

  describe("unarchive", () => {
    it("should call PATCH /notes/:note_code/extract", async () => {
      mockHttp.request.mockResolvedValue(undefined);

      await client.unarchive("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith(
        "PATCH",
        "/notes/abc123/extract"
      );
    });
  });
});
