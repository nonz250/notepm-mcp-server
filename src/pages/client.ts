/**
 * Page domain API client
 */
import { HttpClient } from "../shared/http-client.js";
import type {
  CreatePageParams,
  Page,
  PageResponse,
  PagesResponse,
  SearchPagesParams,
  UpdatePageParams,
} from "./types.js";

export class PageClient {
  constructor(private http: HttpClient) {}

  /**
   * Search pages
   * GET /api/v1/pages
   */
  async search(params: SearchPagesParams = {}): Promise<PagesResponse> {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set("q", params.q);
    if (params.only_title) searchParams.set("only_title", "1");
    if (params.include_archived) searchParams.set("include_archived", "1");
    if (params.note_code) searchParams.set("note_code", params.note_code);
    if (params.tag_name) searchParams.set("tag_name", params.tag_name);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/pages${query ? `?${query}` : ""}`;

    return this.http.request<PagesResponse>("GET", path);
  }

  /**
   * Get page
   * GET /api/v1/pages/:page_code
   */
  async get(pageCode: string): Promise<Page> {
    const response = await this.http.request<PageResponse>("GET", `/pages/${pageCode}`);
    return response.page;
  }

  /**
   * Create page
   * POST /api/v1/pages
   */
  async create(params: CreatePageParams): Promise<Page> {
    const response = await this.http.request<PageResponse>("POST", "/pages", params);
    return response.page;
  }

  /**
   * Update page
   * PATCH /api/v1/pages/:page_code
   */
  async update(pageCode: string, params: UpdatePageParams): Promise<Page> {
    const response = await this.http.request<PageResponse>("PATCH", `/pages/${pageCode}`, params);
    return response.page;
  }
}
