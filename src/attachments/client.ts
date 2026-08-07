/**
 * Attachment domain API client
 */
import { HttpClient } from "../shared/http-client.js";
import type { AttachmentsResponse, SearchAttachmentsParams } from "./types.js";

export class AttachmentClient {
  constructor(private http: HttpClient) {}

  /**
   * Search attachments
   * GET /api/v1/attachments
   */
  async search(params: SearchAttachmentsParams = {}): Promise<AttachmentsResponse> {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set("q", params.q);
    if (params.file_name) searchParams.set("file_name", params.file_name);
    if (params.note_code) searchParams.set("note_code", params.note_code);
    if (params.page_code) searchParams.set("page_code", params.page_code);
    if (params.include_archived) searchParams.set("include_archived", "1");
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/attachments${query ? `?${query}` : ""}`;

    return this.http.request<AttachmentsResponse>("GET", path);
  }
}
