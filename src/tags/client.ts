/**
 * Tag domain API client
 */
import { HttpClient } from "../shared/http-client.js";
import type { CreateTagParams, ListTagsParams, Tag, TagResponse, TagsResponse } from "./types.js";

export class TagClient {
  constructor(private http: HttpClient) {}

  /**
   * List tags
   * GET /api/v1/tags
   */
  async list(params: ListTagsParams = {}): Promise<TagsResponse> {
    const searchParams = new URLSearchParams();

    if (params.note_code) searchParams.set("note_code", params.note_code);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/tags${query ? `?${query}` : ""}`;

    return this.http.request<TagsResponse>("GET", path);
  }

  /**
   * Create tag
   * POST /api/v1/tags
   */
  async create(params: CreateTagParams): Promise<Tag> {
    const response = await this.http.request<TagResponse>("POST", "/tags", params);
    return response.tag;
  }
}
