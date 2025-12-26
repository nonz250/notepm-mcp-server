/**
 * Shared Test Fixtures
 *
 * Common mock data factories for tests
 */
import { Note, NotesResponse, Page, PagesResponse } from "../notepm-client.js";

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
  description: "Test note description",
  icon_url: null,
  archived: false,
  scope: "open",
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
