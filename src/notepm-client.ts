/**
 * NotePM API Client
 *
 * Handles communication with NotePM REST API
 * https://notepm.jp/docs/api
 */
import { Config } from "./config.js";

// ============================================================
// Type definitions
// ============================================================

/** User information */
export interface User {
  user_code: string;
  name: string;
}

/** Tag information */
export interface Tag {
  name: string;
}

/** Note information */
export interface Note {
  note_code: string;
  name: string;
  description: string;
  icon_url: string | null;
  archived: boolean;
  scope: "open" | "private";
}

/** Page information */
export interface Page {
  page_code: string;
  note_code: string;
  folder_id: number | null;
  title: string;
  body: string;
  memo: string;
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by: User;
  tags: Tag[];
}

/** Pagination metadata */
export interface PaginationMeta {
  previous_page: string | null;
  next_page: string | null;
  page: number;
  per_page: number;
  total: number;
}

/** Pages list response */
export interface PagesResponse {
  pages: Page[];
  meta: PaginationMeta;
}

/** Single page response */
export interface PageResponse {
  page: Page;
}

/** Notes list response */
export interface NotesResponse {
  notes: Note[];
  meta: PaginationMeta;
}

/** List notes parameters */
export interface ListNotesParams {
  include_archived?: boolean;
  page?: number;
  per_page?: number;
}

/** Search pages parameters */
export interface SearchPagesParams {
  q?: string;
  only_title?: boolean;
  include_archived?: boolean;
  note_code?: string;
  tag_name?: string;
  page?: number;
  per_page?: number;
}

/** Create page parameters */
export interface CreatePageParams {
  note_code: string;
  title: string;
  body?: string;
  memo?: string;
  folder_id?: number;
  tags?: string[];
}

/** API Error */
export class NotePMAPIError extends Error {
  constructor(
    public statusCode: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = "NotePMAPIError";
  }
}

// ============================================================
// API Client
// ============================================================

export class NotePMClient {
  private baseUrl: string;
  private accessToken: string;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl;
    this.accessToken = config.accessToken;
  }

  /**
   * Send API request
   */
  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new NotePMAPIError(
        response.status,
        response.statusText,
        `NotePM API Error: ${String(response.status)} ${response.statusText}\n${errorText}`
      );
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  /**
   * List notes
   * GET /api/v1/notes
   */
  async listNotes(params: ListNotesParams = {}): Promise<NotesResponse> {
    const searchParams = new URLSearchParams();

    if (params.include_archived) searchParams.set("include_archived", "1");
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/notes${query ? `?${query}` : ""}`;

    return this.request<NotesResponse>("GET", path);
  }

  /**
   * Search pages
   * GET /api/v1/pages
   */
  async searchPages(params: SearchPagesParams = {}): Promise<PagesResponse> {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set("q", params.q);
    if (params.only_title) searchParams.set("only_title", "true");
    if (params.include_archived) searchParams.set("include_archived", "true");
    if (params.note_code) searchParams.set("note_code", params.note_code);
    if (params.tag_name) searchParams.set("tag_name", params.tag_name);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/pages${query ? `?${query}` : ""}`;

    return this.request<PagesResponse>("GET", path);
  }

  /**
   * Get page
   * GET /api/v1/pages/:page_code
   */
  async getPage(pageCode: string): Promise<Page> {
    const response = await this.request<PageResponse>("GET", `/pages/${pageCode}`);
    return response.page;
  }

  /**
   * Create page
   * POST /api/v1/pages
   */
  async createPage(params: CreatePageParams): Promise<Page> {
    const response = await this.request<PageResponse>("POST", "/pages", params);
    return response.page;
  }

  /**
   * Update page
   * PATCH /api/v1/pages/:page_code
   */
  async updatePage(
    pageCode: string,
    params: Partial<Omit<CreatePageParams, "note_code">>
  ): Promise<Page> {
    const response = await this.request<PageResponse>("PATCH", `/pages/${pageCode}`, params);
    return response.page;
  }

  /**
   * Delete page
   * DELETE /api/v1/pages/:page_code
   */
  async deletePage(pageCode: string): Promise<void> {
    await this.request<undefined>("DELETE", `/pages/${pageCode}`);
  }
}
