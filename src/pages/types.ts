/**
 * Page domain types
 */
import type { PaginationMeta, Tag, User } from "../shared/types.js";

// Re-export Tag for use by consumers of this module
export type { Tag };

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

/** Single page response */
export interface PageResponse {
  page: Page;
}

/** Pages list response */
export interface PagesResponse {
  pages: Page[];
  meta: PaginationMeta;
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

/** Update page parameters */
export interface UpdatePageParams {
  title?: string;
  body?: string;
  memo?: string;
  tags?: string[];
}

/** Tool name constants for pages */
export const PAGE_TOOL_NAMES = {
  SEARCH_PAGES: "search_pages",
  GET_PAGE: "get_page",
  CREATE_PAGE: "create_page",
  UPDATE_PAGE: "update_page",
} as const;

/** Type representing valid page tool names */
export type PageToolName = (typeof PAGE_TOOL_NAMES)[keyof typeof PAGE_TOOL_NAMES];
