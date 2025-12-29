/**
 * FolderClient Tests
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HttpClient } from "../../shared/http-client.js";
import { FolderClient } from "../client.js";

describe("FolderClient", () => {
  let client: FolderClient;
  let mockHttp: { request: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHttp = { request: vi.fn() };
    client = new FolderClient(mockHttp as unknown as HttpClient);
  });

  describe("list", () => {
    it("should call GET /notes/:note_code/folders", async () => {
      mockHttp.request.mockResolvedValue({ folders: [] });

      await client.list({ note_code: "abc123" });

      expect(mockHttp.request).toHaveBeenCalledWith("GET", "/notes/abc123/folders");
    });

    it("should return folders response", async () => {
      const mockFolders = [
        { folder_id: 1, name: "Folder 1", parent_folder_id: null },
        { folder_id: 2, name: "Folder 2", parent_folder_id: 1 },
      ];
      mockHttp.request.mockResolvedValue({ folders: mockFolders });

      const result = await client.list({ note_code: "abc123" });

      expect(result.folders).toEqual(mockFolders);
    });
  });
});
