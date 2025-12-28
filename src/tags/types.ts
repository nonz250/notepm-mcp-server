/**
 * Tag domain types
 */
import type { PaginationMeta, Tag } from "../shared/types.js";

// Re-export Tag for use by consumers of this module
export type { Tag };

/** Single tag response */
export interface TagResponse {
  tag: Tag;
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

/** Create tag parameters */
export interface CreateTagParams {
  name: string;
}

/** Delete tag parameters */
export interface DeleteTagParams {
  name: string;
}

/** Tool name constants for tags */
export const TAG_TOOL_NAMES = {
  LIST_TAGS: "list_tags",
  CREATE_TAG: "create_tag",
  DELETE_TAG: "delete_tag",
} as const;

/** Type representing valid tag tool names */
export type TagToolName = (typeof TAG_TOOL_NAMES)[keyof typeof TAG_TOOL_NAMES];
