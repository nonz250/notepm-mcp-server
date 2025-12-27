import { describe, it, expect } from "vitest";
import { TOOLS } from "../tools/definitions.js";
import { TOOL_NAMES } from "../tools/constants.js";

describe("TOOLS", () => {
  it("should have all expected tools defined", () => {
    const toolNames = TOOLS.map((tool) => tool.name);

    expect(toolNames).toContain(TOOL_NAMES.SEARCH_PAGES);
    expect(toolNames).toContain(TOOL_NAMES.GET_PAGE);
    expect(toolNames).toContain(TOOL_NAMES.CREATE_PAGE);
    expect(toolNames).toContain(TOOL_NAMES.UPDATE_PAGE);
    expect(toolNames).toContain(TOOL_NAMES.DELETE_PAGE);
    expect(toolNames).toContain(TOOL_NAMES.LIST_NOTES);
    expect(toolNames).toContain(TOOL_NAMES.GET_NOTE);
    expect(toolNames).toContain(TOOL_NAMES.CREATE_NOTE);
    expect(toolNames).toContain(TOOL_NAMES.UPDATE_NOTE);
    expect(toolNames).toContain(TOOL_NAMES.DELETE_NOTE);
    expect(toolNames).toContain(TOOL_NAMES.ARCHIVE_NOTE);
    expect(toolNames).toContain(TOOL_NAMES.UNARCHIVE_NOTE);
    expect(toolNames).toContain(TOOL_NAMES.LIST_TAGS);
    expect(toolNames).toContain(TOOL_NAMES.CREATE_TAG);
    expect(toolNames).toContain(TOOL_NAMES.DELETE_TAG);
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
      expect(tool.description.length).toBeGreaterThan(0);
    }
  });
});
