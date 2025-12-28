/**
 * Attachment Schema Validation Tests
 */
import { describe, expect, it } from "vitest";

import { SearchAttachmentsInputSchema, UploadAttachmentInputSchema } from "../schemas.js";

describe("SearchAttachmentsInputSchema", () => {
  it("should accept empty input with defaults", () => {
    const result = SearchAttachmentsInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.per_page).toBe(20);
    }
  });

  it("should accept q parameter", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ q: "document" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("document");
    }
  });

  it("should accept file_name parameter", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ file_name: "report.pdf" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.file_name).toBe("report.pdf");
    }
  });

  it("should accept note_code parameter", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ note_code: "note123" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.note_code).toBe("note123");
    }
  });

  it("should accept page_code parameter", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ page_code: "page456" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page_code).toBe("page456");
    }
  });

  it("should accept include_archived parameter", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ include_archived: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.include_archived).toBe(true);
    }
  });

  it("should accept page parameter", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ page: 2 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
    }
  });

  it("should accept per_page at minimum boundary (1)", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ per_page: 1 });
    expect(result.success).toBe(true);
  });

  it("should accept per_page at maximum boundary (100)", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ per_page: 100 });
    expect(result.success).toBe(true);
  });

  it("should reject per_page below minimum (0)", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ per_page: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject per_page above maximum (101)", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ per_page: 101 });
    expect(result.success).toBe(false);
  });

  it("should reject page below minimum (0)", () => {
    const result = SearchAttachmentsInputSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });
});

describe("UploadAttachmentInputSchema", () => {
  const validInput = {
    file_name: "document.pdf",
    file_data: "SGVsbG8gV29ybGQ=", // "Hello World" in base64
    note_code: "note123",
  };

  it("should accept valid input with required fields", () => {
    const result = UploadAttachmentInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.file_name).toBe("document.pdf");
      expect(result.data.file_data).toBe("SGVsbG8gV29ybGQ=");
      expect(result.data.note_code).toBe("note123");
    }
  });

  it("should accept input with optional page_code", () => {
    const result = UploadAttachmentInputSchema.safeParse({
      ...validInput,
      page_code: "page456",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page_code).toBe("page456");
    }
  });

  it("should reject empty file_name", () => {
    const result = UploadAttachmentInputSchema.safeParse({
      ...validInput,
      file_name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty file_data", () => {
    const result = UploadAttachmentInputSchema.safeParse({
      ...validInput,
      file_data: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty note_code", () => {
    const result = UploadAttachmentInputSchema.safeParse({
      ...validInput,
      note_code: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing file_name", () => {
    const result = UploadAttachmentInputSchema.safeParse({
      file_data: validInput.file_data,
      note_code: validInput.note_code,
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing file_data", () => {
    const result = UploadAttachmentInputSchema.safeParse({
      file_name: validInput.file_name,
      note_code: validInput.note_code,
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing note_code", () => {
    const result = UploadAttachmentInputSchema.safeParse({
      file_name: validInput.file_name,
      file_data: validInput.file_data,
    });
    expect(result.success).toBe(false);
  });
});
