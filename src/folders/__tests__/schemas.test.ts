/**
 * Folder Schema Validation Tests
 */
import { describe, expect, it } from "vitest";

import { ListFoldersInputSchema } from "../schemas.js";

describe("ListFoldersInputSchema", () => {
  it("should require note_code", () => {
    const result = ListFoldersInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept valid note_code", () => {
    const result = ListFoldersInputSchema.safeParse({ note_code: "abc123" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.note_code).toBe("abc123");
    }
  });

  it("should reject empty note_code", () => {
    const result = ListFoldersInputSchema.safeParse({ note_code: "" });
    expect(result.success).toBe(false);
  });

  it("should reject non-string note_code", () => {
    const result = ListFoldersInputSchema.safeParse({ note_code: 123 });
    expect(result.success).toBe(false);
  });
});
