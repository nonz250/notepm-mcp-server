import { describe, expect, it } from "vitest";

import { ATTACHMENT_TOOL_NAMES } from "../../attachments/types.js";
import { FOLDER_TOOL_NAMES } from "../../folders/types.js";
import { NOTE_TOOL_NAMES } from "../../notes/types.js";
import { PAGE_TOOL_NAMES } from "../../pages/types.js";
import { TAG_TOOL_NAMES } from "../../tags/types.js";
import { TOOLS } from "../index.js";

describe("TOOLS", () => {
  it("should have all expected tools defined", () => {
    const toolNames = TOOLS.map((tool) => tool.name);

    // Attachment tools
    expect(toolNames).toContain(ATTACHMENT_TOOL_NAMES.SEARCH_ATTACHMENTS);

    // Folder tools
    expect(toolNames).toContain(FOLDER_TOOL_NAMES.LIST_FOLDERS);

    // Note tools
    expect(toolNames).toContain(NOTE_TOOL_NAMES.LIST_NOTES);

    // Page tools
    expect(toolNames).toContain(PAGE_TOOL_NAMES.SEARCH_PAGES);
    expect(toolNames).toContain(PAGE_TOOL_NAMES.GET_PAGE);
    expect(toolNames).toContain(PAGE_TOOL_NAMES.CREATE_PAGE);
    expect(toolNames).toContain(PAGE_TOOL_NAMES.UPDATE_PAGE);

    // Tag tools
    expect(toolNames).toContain(TAG_TOOL_NAMES.LIST_TAGS);
    expect(toolNames).toContain(TAG_TOOL_NAMES.CREATE_TAG);
  });

  it("should have valid inputSchema for each tool", () => {
    for (const tool of TOOLS) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe("object");
      expect(tool.inputSchema).toHaveProperty("properties");
    }
  });

  it("should have description for each tool", () => {
    for (const tool of TOOLS) {
      expect(tool.description).toBeDefined();
      expect(typeof tool.description).toBe("string");
      expect(tool.description?.length).toBeGreaterThan(0);
    }
  });
});
