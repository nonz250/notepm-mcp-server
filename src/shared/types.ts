/**
 * Shared type definitions
 */

/** User information */
export interface User {
  user_code: string;
  name: string;
}

/** Pagination metadata */
export interface PaginationMeta {
  previous_page: string | null;
  next_page: string | null;
  page: number;
  per_page: number;
  total: number;
}
