/**
 * Schema Validation Tests
 *
 * Tests for Zod input schemas with boundary conditions
 */
import { describe, expect, it } from "vitest";

import {
  CreatePageInputSchema,
  DeletePageInputSchema,
  GetPageInputSchema,
  ListNotesInputSchema,
  SearchPagesInputSchema,
  UpdatePageInputSchema,
} from "../tools/schemas.js";

describe("SearchPagesInputSchema", () => {
  it("should accept empty input with defaults", () => {
    const result = SearchPagesInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.per_page).toBe(20);
    }
  });

  it("should accept valid search params", () => {
    const result = SearchPagesInputSchema.safeParse({
      query: "test",
      note_code: "abc123",
      per_page: 50,
    });
    expect(result.success).toBe(true);
  });

  it("should accept tag_name parameter", () => {
    const result = SearchPagesInputSchema.safeParse({
      tag_name: "important",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tag_name).toBe("important");
    }
  });

  it("should accept per_page at minimum boundary (1)", () => {
    const result = SearchPagesInputSchema.safeParse({ per_page: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept per_page at maximum boundary (100)", () => {
    const result = SearchPagesInputSchema.safeParse({ per_page: 100 });
    expect(result.success).toBe(true);
  });

  it("should reject per_page below minimum (0)", () => {
    const result = SearchPagesInputSchema.safeParse({ per_page: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject per_page above maximum (101)", () => {
    const result = SearchPagesInputSchema.safeParse({ per_page: 101 });
    expect(result.success).toBe(false);
  });

  it("should reject non-number per_page", () => {
    const result = SearchPagesInputSchema.safeParse({ per_page: "50" });
    expect(result.success).toBe(false);
  });

  it("should reject non-string query", () => {
    const result = SearchPagesInputSchema.safeParse({ query: 123 });
    expect(result.success).toBe(false);
  });
});

describe("GetPageInputSchema", () => {
  it("should require page_code", () => {
    const result = GetPageInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept valid page_code", () => {
    const result = GetPageInputSchema.safeParse({ page_code: "abc123" });
    expect(result.success).toBe(true);
  });

  it("should reject non-string page_code", () => {
    const result = GetPageInputSchema.safeParse({ page_code: 123 });
    expect(result.success).toBe(false);
  });

  it("should reject empty string page_code", () => {
    const result = GetPageInputSchema.safeParse({ page_code: "" });
    expect(result.success).toBe(false);
  });
});

describe("CreatePageInputSchema", () => {
  it("should require note_code and title", () => {
    const result = CreatePageInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should fail with only note_code", () => {
    const result = CreatePageInputSchema.safeParse({ note_code: "abc123" });
    expect(result.success).toBe(false);
  });

  it("should fail with only title", () => {
    const result = CreatePageInputSchema.safeParse({ title: "Test" });
    expect(result.success).toBe(false);
  });

  it("should accept valid create params", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "Test Page",
      body: "Content here",
    });
    expect(result.success).toBe(true);
  });

  it("should accept all optional fields", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "Test Page",
      body: "Content",
      memo: "Memo text",
      tags: ["tag1", "tag2"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["tag1", "tag2"]);
    }
  });

  it("should accept title at maximum boundary (100 chars)", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "a".repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it("should reject title over 100 characters", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty title", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty note_code", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "",
      title: "Test",
    });
    expect(result.success).toBe(false);
  });

  it("should accept memo at maximum boundary (255 chars)", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "Test",
      memo: "a".repeat(255),
    });
    expect(result.success).toBe(true);
  });

  it("should reject memo over 255 characters", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "Test",
      memo: "a".repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it("should accept empty tags array", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "Test",
      tags: [],
    });
    expect(result.success).toBe(true);
  });

  it("should reject non-string elements in tags", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "Test",
      tags: ["valid", 123],
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdatePageInputSchema", () => {
  it("should require page_code", () => {
    const result = UpdatePageInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept partial update with only title", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
      title: "Updated Title",
    });
    expect(result.success).toBe(true);
  });

  it("should accept partial update with only body", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
      body: "Updated body content",
    });
    expect(result.success).toBe(true);
  });

  it("should accept update with all fields", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
      title: "Updated Title",
      body: "Updated body",
      memo: "Updated memo",
      tags: ["newtag"],
    });
    expect(result.success).toBe(true);
  });

  it("should accept page_code only (no updates)", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject title over 100 characters", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
      title: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("should reject memo over 255 characters", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
      memo: "a".repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it("should accept tags update", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
      tags: ["tag1", "tag2", "tag3"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toHaveLength(3);
    }
  });

  it("should reject empty page_code", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "",
      title: "Updated Title",
    });
    expect(result.success).toBe(false);
  });
});

describe("DeletePageInputSchema", () => {
  it("should require page_code", () => {
    const result = DeletePageInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept valid page_code", () => {
    const result = DeletePageInputSchema.safeParse({ page_code: "abc123" });
    expect(result.success).toBe(true);
  });

  it("should reject non-string page_code", () => {
    const result = DeletePageInputSchema.safeParse({ page_code: 123 });
    expect(result.success).toBe(false);
  });

  it("should reject null page_code", () => {
    const result = DeletePageInputSchema.safeParse({ page_code: null });
    expect(result.success).toBe(false);
  });

  it("should reject empty page_code", () => {
    const result = DeletePageInputSchema.safeParse({ page_code: "" });
    expect(result.success).toBe(false);
  });
});

describe("ListNotesInputSchema", () => {
  it("should accept empty input with defaults", () => {
    const result = ListNotesInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.per_page).toBe(20);
    }
  });

  it("should accept include_archived flag", () => {
    const result = ListNotesInputSchema.safeParse({ include_archived: true });
    expect(result.success).toBe(true);
  });

  it("should reject per_page out of range", () => {
    const result = ListNotesInputSchema.safeParse({ per_page: 200 });
    expect(result.success).toBe(false);
  });
});
