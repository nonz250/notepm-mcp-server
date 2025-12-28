/**
 * Folder domain API client
 */
import { HttpClient } from "../shared/http-client.js";
import type { FoldersResponse, ListFoldersParams } from "./types.js";

export class FolderClient {
  constructor(private http: HttpClient) {}

  /**
   * List folders in a note
   * GET /api/v1/notes/:note_code/folders
   */
  async list(params: ListFoldersParams): Promise<FoldersResponse> {
    return this.http.request<FoldersResponse>("GET", `/notes/${params.note_code}/folders`);
  }
}
