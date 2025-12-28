/**
 * Tag Schema Validation Tests
 */
import { describe, expect, it } from "vitest";

import {
  CreateTagInputSchema,
  ListTagsInputSchema,
} from "../schemas.js";

describe("ListTagsInputSchema", () => {
  it("should accept empty input with defaults", () => {
    const result = ListTagsInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.per_page).toBe(50);
    }
  });

  it("should accept note_code parameter", () => {
    const result = ListTagsInputSchema.safeParse({ note_code: "note123" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.note_code).toBe("note123");
    }
  });

  it("should accept page parameter", () => {
    const result = ListTagsInputSchema.safeParse({ page: 2 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
    }
  });

  it("should accept per_page at minimum boundary (1)", () => {
    const result = ListTagsInputSchema.safeParse({ per_page: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept per_page at maximum boundary (100)", () => {
    const result = ListTagsInputSchema.safeParse({ per_page: 100 });
    expect(result.success).toBe(true);
  });

  it("should reject per_page below minimum (0)", () => {
    const result = ListTagsInputSchema.safeParse({ per_page: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject per_page above maximum (101)", () => {
    const result = ListTagsInputSchema.safeParse({ per_page: 101 });
    expect(result.success).toBe(false);
  });

  it("should reject page below minimum (0)", () => {
    const result = ListTagsInputSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });
});

describe("CreateTagInputSchema", () => {
  it("should require name", () => {
    const result = CreateTagInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept valid name", () => {
    const result = CreateTagInputSchema.safeParse({ name: "my-tag" });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = CreateTagInputSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("should reject non-string name", () => {
    const result = CreateTagInputSchema.safeParse({ name: 123 });
    expect(result.success).toBe(false);
  });

  it("should accept name at maximum boundary (100 chars)", () => {
    const result = CreateTagInputSchema.safeParse({ name: "a".repeat(100) });
    expect(result.success).toBe(true);
  });

  it("should reject name over 100 characters", () => {
    const result = CreateTagInputSchema.safeParse({ name: "a".repeat(101) });
    expect(result.success).toBe(false);
  });
});
