/**
 * AttachmentClient Tests
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HttpClient } from "../../shared/http-client.js";
import { AttachmentClient } from "../client.js";

describe("AttachmentClient", () => {
  let client: AttachmentClient;
  let mockHttp: { request: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHttp = { request: vi.fn() };
    client = new AttachmentClient(mockHttp as unknown as HttpClient);
  });

  describe("search", () => {
    it("should call GET /attachments with no params", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search();

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/attachments");
    });

    it("should include q param", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search({ q: "document" });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/attachments?q=document");
    });

    it("should include file_name param", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search({ file_name: "report.pdf" });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/attachments?file_name=report.pdf");
    });

    it("should include note_code param", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search({ note_code: "note123" });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/attachments?note_code=note123");
    });

    it("should include page_code param", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search({ page_code: "page456" });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/attachments?page_code=page456");
    });

    it("should include include_archived param", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search({ include_archived: true });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/attachments?include_archived=1");
    });

    it("should include pagination params", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search({ page: 2, per_page: 50 });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/attachments?page=2&per_page=50");
    });

    it("should include all params", async () => {
      mockHttp.request.mockResolvedValue({ attachments: [], meta: {} });

      await client.search({
        q: "doc",
        file_name: "report",
        note_code: "note123",
        page_code: "page456",
        include_archived: true,
        page: 2,
        per_page: 50,
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        "GET",
        "/attachments?q=doc&file_name=report&note_code=note123&page_code=page456&include_archived=1&page=2&per_page=50"
      );
    });
  });
});
