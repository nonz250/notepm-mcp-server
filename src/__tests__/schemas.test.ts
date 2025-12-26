import { describe, it, expect } from "vitest";
import {
  SearchPagesInputSchema,
  GetPageInputSchema,
  CreatePageInputSchema,
  UpdatePageInputSchema,
  DeletePageInputSchema,
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

  it("should reject per_page out of range", () => {
    const result = SearchPagesInputSchema.safeParse({ per_page: 200 });
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
});

describe("CreatePageInputSchema", () => {
  it("should require note_code and title", () => {
    const result = CreatePageInputSchema.safeParse({});
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

  it("should reject title over 100 characters", () => {
    const result = CreatePageInputSchema.safeParse({
      note_code: "abc123",
      title: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdatePageInputSchema", () => {
  it("should require page_code", () => {
    const result = UpdatePageInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept partial update", () => {
    const result = UpdatePageInputSchema.safeParse({
      page_code: "abc123",
      title: "Updated Title",
    });
    expect(result.success).toBe(true);
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
});
