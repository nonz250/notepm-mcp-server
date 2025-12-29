/**
 * Shared Test Fixtures
 *
 * Common mock data factories for tests
 */
import type { Attachment, AttachmentsResponse } from "../../attachments/types.js";
import type { Folder, FoldersResponse } from "../../folders/types.js";
import type { Note, NotesResponse } from "../../notes/types.js";
import type { Page, PagesResponse } from "../../pages/types.js";
import type { TagsResponse } from "../../tags/types.js";
import type { Tag } from "../types.js";

/**
 * Create a mock Page object with optional overrides
 */
export const createMockPage = (overrides: Partial<Page> = {}): Page => ({
  page_code: "page123",
  note_code: "note456",
  folder_id: null,
  title: "Test Page",
  body: "Test body content",
  memo: "Test memo",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  created_by: { user_code: "user1", name: "Test User" },
  updated_by: { user_code: "user1", name: "Test User" },
  tags: [{ name: "tag1" }, { name: "tag2" }],
  ...overrides,
});

/**
 * Create a mock PagesResponse object
 */
export const createMockPagesResponse = (pages: Page[], total?: number): PagesResponse => ({
  pages,
  meta: {
    previous_page: null,
    next_page: null,
    page: 1,
    per_page: 20,
    total: total ?? pages.length,
  },
});

/**
 * Create a mock Note object with optional overrides
 */
export const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  note_code: "note123",
  name: "Test Note",
  description: "Test description",
  scope: "open",
  icon_url: null,
  archived: false,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  ...overrides,
});

/**
 * Create a mock NotesResponse object
 */
export const createMockNotesResponse = (notes: Note[], total?: number): NotesResponse => ({
  notes,
  meta: {
    previous_page: null,
    next_page: null,
    page: 1,
    per_page: 20,
    total: total ?? notes.length,
  },
});

/**
 * Create a mock Tag object with optional overrides
 */
export const createMockTag = (overrides: Partial<Tag> = {}): Tag => ({
  name: "test-tag",
  page_count: 5,
  ...overrides,
});

/**
 * Create a mock TagsResponse object
 */
export const createMockTagsResponse = (tags: Tag[], total?: number): TagsResponse => ({
  tags,
  meta: {
    previous_page: null,
    next_page: null,
    page: 1,
    per_page: 50,
    total: total ?? tags.length,
  },
});

/**
 * Create a mock Attachment object with optional overrides
 */
export const createMockAttachment = (overrides: Partial<Attachment> = {}): Attachment => ({
  file_id: "file123",
  file_name: "document.pdf",
  file_size: 1024000,
  note_code: "note456",
  page_code: "page789",
  comment_number: null,
  download_url: "https://example.notepm.jp/api/v1/attachments/download/file123",
  created_at: "2024-01-01T00:00:00Z",
  ...overrides,
});

/**
 * Create a mock AttachmentsResponse object
 */
export const createMockAttachmentsResponse = (
  attachments: Attachment[],
  total?: number
): AttachmentsResponse => ({
  attachments,
  meta: {
    previous_page: null,
    next_page: null,
    page: 1,
    per_page: 20,
    total: total ?? attachments.length,
  },
});

/**
 * Create a mock Folder object with optional overrides
 */
export const createMockFolder = (overrides: Partial<Folder> = {}): Folder => ({
  folder_id: 1,
  name: "Test Folder",
  parent_folder_id: null,
  ...overrides,
});

/**
 * Create a mock FoldersResponse object
 */
export const createMockFoldersResponse = (folders: Folder[]): FoldersResponse => ({
  folders,
});
