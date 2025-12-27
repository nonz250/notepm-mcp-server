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
  page_count?: number;
}

/** Note information */
export interface Note {
  note_code: string;
  name: string;
  description: string;
  scope: "open" | "private" | number;
  icon_url: string | null;
  archived: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Single note response */
export interface NoteResponse {
  note: Note;
}

/** Create note parameters */
export interface CreateNoteParams {
  name: string;
  description?: string;
  scope: "open" | "private";
  groups?: string[];
  users?: string[];
}

/** Update note parameters */
export interface UpdateNoteParams {
  name?: string;
  description?: string;
  scope?: "open" | "private";
  groups?: string[];
  users?: string[];
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

/** Tags list response */
export interface TagsResponse {
  tags: Tag[];
  meta: PaginationMeta;
}

/** List tags parameters */
export interface ListTagsParams {
  note_code?: string;
  page?: number;
  per_page?: number;
}

/** Single tag response */
export interface TagResponse {
  tag: Tag;
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

/** Create tag parameters */
export interface CreateTagParams {
  name: string;
}

/** Delete tag parameters */
export interface DeleteTagParams {
  name: string;
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
    if (params.only_title) searchParams.set("only_title", "1");
    if (params.include_archived) searchParams.set("include_archived", "1");
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

  /**
   * Create note
   * POST /api/v1/notes
   */
  async createNote(params: CreateNoteParams): Promise<Note> {
    const response = await this.request<NoteResponse>("POST", "/notes", params);
    return response.note;
  }

  /**
   * Update note
   * PATCH /api/v1/notes/:note_code
   */
  async updateNote(noteCode: string, params: UpdateNoteParams): Promise<Note> {
    const response = await this.request<NoteResponse>("PATCH", `/notes/${noteCode}`, params);
    return response.note;
  }

  /**
   * Delete note
   * DELETE /api/v1/notes/:note_code
   */
  async deleteNote(noteCode: string): Promise<void> {
    await this.request<undefined>("DELETE", `/notes/${noteCode}`);
  }

  /**
   * List tags
   * GET /api/v1/tags
   */
  async listTags(params: ListTagsParams = {}): Promise<TagsResponse> {
    const searchParams = new URLSearchParams();

    if (params.note_code) searchParams.set("note_code", params.note_code);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page) searchParams.set("per_page", params.per_page.toString());

    const query = searchParams.toString();
    const path = `/tags${query ? `?${query}` : ""}`;

    return this.request<TagsResponse>("GET", path);
  }

  /**
   * Create tag
   * POST /api/v1/tags
   */
  async createTag(params: CreateTagParams): Promise<Tag> {
    const response = await this.request<TagResponse>("POST", "/tags", params);
    return response.tag;
  }

  /**
   * Delete tag
   * DELETE /api/v1/tags
   */
  async deleteTag(params: DeleteTagParams): Promise<void> {
    await this.request<undefined>("DELETE", "/tags", params);
  }
}
