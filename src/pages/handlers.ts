/**
 * Page domain handlers
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { parseInput, success } from "../shared/result.js";
import { PageClient } from "./client.js";
import {
  CreatePageInputSchema,
  DeletePageInputSchema,
  GetPageInputSchema,
  SearchPagesInputSchema,
  UpdatePageInputSchema,
} from "./schemas.js";
import type { Page, PageToolName } from "./types.js";
import { PAGE_TOOL_NAMES } from "./types.js";

/**
 * Format page information
 */
function formatPage(page: Page): string {
  const tags = page.tags.map((t) => t.name).join(", ") || "None";
  return [
    `## ${page.title}`,
    `- Page code: ${page.page_code}`,
    `- Note code: ${page.note_code}`,
    `- Created by: ${page.created_by.name}`,
    `- Created at: ${page.created_at}`,
    `- Updated at: ${page.updated_at}`,
    `- Tags: ${tags}`,
    "",
    "### Body",
    page.body || "(No body)",
  ].join("\n");
}

/**
 * Check if the tool name is a page tool
 */
export function isPageToolName(name: string): name is PageToolName {
  return Object.values(PAGE_TOOL_NAMES).includes(name as PageToolName);
}

/**
 * Handle page tool calls
 */
export async function handlePageToolCall(
  client: PageClient,
  name: PageToolName,
  args: unknown
): Promise<CallToolResult> {
  switch (name) {
    case PAGE_TOOL_NAMES.SEARCH_PAGES: {
      const { query, note_code, tag_name, page, per_page } = parseInput(SearchPagesInputSchema, args);
      const result = await client.search({ q: query, note_code, tag_name, page, per_page });

      if (result.pages.length === 0) {
        return success("Search results: 0 pages");
      }

      const pageList = result.pages
        .map(
          (p, i) =>
            `${String(i + 1)}. **${p.title}** (code: ${p.page_code})\n   - Note: ${p.note_code} | Updated: ${p.updated_at}`
        )
        .join("\n");

      return success(
        `Search results: showing ${String(result.pages.length)} of ${String(result.meta.total)} pages\n\n${pageList}`
      );
    }

    case PAGE_TOOL_NAMES.GET_PAGE: {
      const { page_code } = parseInput(GetPageInputSchema, args);
      const page = await client.get(page_code);
      return success(formatPage(page));
    }

    case PAGE_TOOL_NAMES.CREATE_PAGE: {
      const { note_code, title, body, memo, tags } = parseInput(CreatePageInputSchema, args);
      const page = await client.create({ note_code, title, body, memo, tags });
      return success(`Page created.\n\n${formatPage(page)}`);
    }

    case PAGE_TOOL_NAMES.UPDATE_PAGE: {
      const { page_code, title, body, memo, tags } = parseInput(UpdatePageInputSchema, args);
      const page = await client.update(page_code, { title, body, memo, tags });
      return success(`Page updated.\n\n${formatPage(page)}`);
    }

    case PAGE_TOOL_NAMES.DELETE_PAGE: {
      const { page_code } = parseInput(DeletePageInputSchema, args);
      await client.delete(page_code);
      return success(`Page deleted: ${page_code}`);
    }
  }
}
