/**
 * Note domain API client
 */
import { HttpClient } from "../shared/http-client.js";
import type { ListNotesParams, NotesResponse } from "./types.js";

export class NoteClient {
  constructor(private http: HttpClient) {}

  /**
   * List notes
   * GET /api/v1/notes
   */
  async list(params: ListNotesParams = {}): Promise<NotesResponse> {
    const searchParams = new URLSearchParams();

    if (params.include_archived) searchParams.set("include_archived", "1");
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/notes${query ? `?${query}` : ""}`;

    return this.http.request<NotesResponse>("GET", path);
  }
}
