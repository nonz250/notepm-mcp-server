/**
 * HttpClient Tests
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "../http-client.js";
import { NotePMAPIError } from "../errors.js";

describe("HttpClient", () => {
  const mockConfig = {
    teamDomain: "test-team",
    accessToken: "test-token",
    baseUrl: "https://test-team.notepm.jp/api/v1",
  };

  let client: HttpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    client = new HttpClient(mockConfig);
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("request", () => {
    it("should make GET request with correct headers", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "test" }),
      });

      await client.request("GET", "/notes");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://test-team.notepm.jp/api/v1/notes",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          },
          body: undefined,
        }
      );
    });

    it("should make POST request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ note: { name: "Test" } }),
      });

      const body = { name: "Test Note", scope: "open" };
      await client.request("POST", "/notes", body);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://test-team.notepm.jp/api/v1/notes",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
    });

    it("should return JSON response", async () => {
      const expectedData = { note: { note_code: "abc123", name: "Test" } };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(expectedData),
      });

      const result = await client.request("GET", "/notes/abc123");

      expect(result).toEqual(expectedData);
    });

    it("should return empty object for 204 No Content", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.reject(new Error("No content")),
      });

      const result = await client.request("DELETE", "/notes/abc123");

      expect(result).toEqual({});
    });

    it("should throw NotePMAPIError on error response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: () => Promise.resolve('{"messages":["Not found"]}'),
      });

      await expect(client.request("GET", "/notes/nonexistent")).rejects.toThrow(
        NotePMAPIError
      );
    });

    it("should include error details in NotePMAPIError", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: () => Promise.resolve('{"messages":["Invalid input"]}'),
      });

      try {
        await client.request("POST", "/notes", {});
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(NotePMAPIError);
        if (error instanceof NotePMAPIError) {
          expect(error.statusCode).toBe(400);
          expect(error.statusText).toBe("Bad Request");
          expect(error.message).toContain("400 Bad Request");
          expect(error.message).toContain("Invalid input");
        }
      }
    });

    it("should handle PATCH requests", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ note: { name: "Updated" } }),
      });

      await client.request("PATCH", "/notes/abc123", { name: "Updated" });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://test-team.notepm.jp/api/v1/notes/abc123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ name: "Updated" }),
        })
      );
    });
  });

  describe("uploadFile", () => {
    it("should make POST request with FormData", async () => {
      const expectedData = { attachment: { file_id: "file123" } };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(expectedData),
      });

      const formData = new FormData();
      formData.append("file", new Blob(["test"]), "test.txt");
      formData.append("note_code", "note123");

      await client.uploadFile("/attachments", formData);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://test-team.notepm.jp/api/v1/attachments",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer test-token",
          },
          body: formData,
        }
      );
    });

    it("should return JSON response", async () => {
      const expectedData = { attachment: { file_id: "file123", file_name: "test.txt" } };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(expectedData),
      });

      const formData = new FormData();
      const result = await client.uploadFile("/attachments", formData);

      expect(result).toEqual(expectedData);
    });

    it("should throw NotePMAPIError on error response", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: () => Promise.resolve('{"messages":["File too large"]}'),
      });

      const formData = new FormData();

      await expect(client.uploadFile("/attachments", formData)).rejects.toThrow(NotePMAPIError);
    });

    it("should include error details in NotePMAPIError", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 413,
        statusText: "Payload Too Large",
        text: () => Promise.resolve('{"messages":["File exceeds maximum size"]}'),
      });

      const formData = new FormData();

      try {
        await client.uploadFile("/attachments", formData);
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(NotePMAPIError);
        if (error instanceof NotePMAPIError) {
          expect(error.statusCode).toBe(413);
          expect(error.statusText).toBe("Payload Too Large");
          expect(error.message).toContain("413 Payload Too Large");
          expect(error.message).toContain("File exceeds maximum size");
        }
      }
    });
  });
});
