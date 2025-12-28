/**
 * Shared type definitions
 */

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

/** Pagination metadata */
export interface PaginationMeta {
  previous_page: string | null;
  next_page: string | null;
  page: number;
  per_page: number;
  total: number;
}
