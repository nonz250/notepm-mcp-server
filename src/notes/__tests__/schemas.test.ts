/**
 * Note Schema Validation Tests
 */
import { describe, expect, it } from "vitest";

import { ListNotesInputSchema } from "../schemas.js";

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

  it("should accept page parameter", () => {
    const result = ListNotesInputSchema.safeParse({ page: 3 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
    }
  });

  it("should reject page below minimum (0)", () => {
    const result = ListNotesInputSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });
});
