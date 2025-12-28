/**
 * Attachment domain API client
 */
import { HttpClient } from "../shared/http-client.js";
import type {
  AttachmentsResponse,
  SearchAttachmentsParams,
  UploadAttachmentParams,
  UploadAttachmentResponse,
} from "./types.js";

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

  /**
   * Upload attachment
   * POST /api/v1/attachments
   */
  async upload(params: UploadAttachmentParams): Promise<UploadAttachmentResponse> {
    // Decode base64 to binary
    const binaryData = Buffer.from(params.file_data, "base64");
    const blob = new Blob([binaryData]);

    const formData = new FormData();
    formData.append("file", blob, params.file_name);
    formData.append("note_code", params.note_code);
    if (params.page_code) {
      formData.append("page_code", params.page_code);
    }

    return this.http.uploadFile<UploadAttachmentResponse>("/attachments", formData);
  }
}
