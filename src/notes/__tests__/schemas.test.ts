/**
 * Note Schema Validation Tests
 */
import { describe, expect, it } from "vitest";

import {
  CreateNoteInputSchema,
  GetNoteInputSchema,
  ListNotesInputSchema,
  UpdateNoteInputSchema,
} from "../schemas.js";

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

describe("GetNoteInputSchema", () => {
  it("should require note_code", () => {
    const result = GetNoteInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept valid note_code", () => {
    const result = GetNoteInputSchema.safeParse({ note_code: "abc123" });
    expect(result.success).toBe(true);
  });

  it("should reject non-string note_code", () => {
    const result = GetNoteInputSchema.safeParse({ note_code: 123 });
    expect(result.success).toBe(false);
  });

  it("should reject empty string note_code", () => {
    const result = GetNoteInputSchema.safeParse({ note_code: "" });
    expect(result.success).toBe(false);
  });

  it("should reject null note_code", () => {
    const result = GetNoteInputSchema.safeParse({ note_code: null });
    expect(result.success).toBe(false);
  });
});

describe("CreateNoteInputSchema", () => {
  it("should require name and scope", () => {
    const result = CreateNoteInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept valid create params", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "Test Note",
      scope: "open",
    });
    expect(result.success).toBe(true);
  });

  it("should accept all optional fields", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "Test Note",
      description: "A description",
      scope: "private",
      groups: ["group1"],
      users: ["user1"],
    });
    expect(result.success).toBe(true);
  });

  it("should accept name at maximum boundary (30 chars)", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "a".repeat(30),
      scope: "open",
    });
    expect(result.success).toBe(true);
  });

  it("should reject name over 30 characters", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "a".repeat(31),
      scope: "open",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty name", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "",
      scope: "open",
    });
    expect(result.success).toBe(false);
  });

  it("should accept description at maximum boundary (200 chars)", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "Test",
      scope: "open",
      description: "a".repeat(200),
    });
    expect(result.success).toBe(true);
  });

  it("should reject description over 200 characters", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "Test",
      scope: "open",
      description: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid scope", () => {
    const result = CreateNoteInputSchema.safeParse({
      name: "Test",
      scope: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateNoteInputSchema", () => {
  it("should require note_code", () => {
    const result = UpdateNoteInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept partial update with only name", () => {
    const result = UpdateNoteInputSchema.safeParse({
      note_code: "abc123",
      name: "Updated Name",
    });
    expect(result.success).toBe(true);
  });

  it("should accept update with all fields", () => {
    const result = UpdateNoteInputSchema.safeParse({
      note_code: "abc123",
      name: "Updated Name",
      description: "Updated description",
      scope: "private",
      groups: ["group1"],
      users: ["user1"],
    });
    expect(result.success).toBe(true);
  });

  it("should reject name over 30 characters", () => {
    const result = UpdateNoteInputSchema.safeParse({
      note_code: "abc123",
      name: "a".repeat(31),
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty note_code", () => {
    const result = UpdateNoteInputSchema.safeParse({
      note_code: "",
      name: "Updated Name",
    });
    expect(result.success).toBe(false);
  });
});
