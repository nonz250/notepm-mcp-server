/**
 * MCP Tool Definitions
 *
 * Define MCP tools for NotePM API integration
 */

import { z } from "zod";
import { NotePMClient, NotePMAPIError, Page } from "./notepm-client.js";

// ============================================================
// Input Schema Definitions (Zod)
// ============================================================

export const SearchPagesInputSchema = z.object({
  query: z.string().optional().describe("Search keyword"),
  note_code: z.string().optional().describe("Note code (search within specific note)"),
  tag_name: z.string().optional().describe("Filter by tag name"),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe("Number of results (1-100, default: 20)"),
});

export const GetPageInputSchema = z.object({
  page_code: z.string().describe("Page code"),
});

export const CreatePageInputSchema = z.object({
  note_code: z.string().describe("Note code to create page in"),
  title: z.string().max(100).describe("Page title (max 100 characters)"),
  body: z.string().optional().describe("Page body (Markdown format)"),
  memo: z.string().max(255).optional().describe("Memo (max 255 characters)"),
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

export const UpdatePageInputSchema = z.object({
  page_code: z.string().describe("Page code to update"),
  title: z.string().max(100).optional().describe("Page title (max 100 characters)"),
  body: z.string().optional().describe("Page body (Markdown format)"),
  memo: z.string().max(255).optional().describe("Memo (max 255 characters)"),
  tags: z.array(z.string()).optional().describe("Array of tags"),
});

export const DeletePageInputSchema = z.object({
  page_code: z.string().describe("Page code to delete"),
});

// ============================================================
// Helper: Convert Zod schema to MCP-compatible JSON Schema
// ============================================================

function toInputSchema(schema: z.ZodType) {
  return z.toJSONSchema(schema, { target: "draft-07" });
}

// ============================================================
// Tool Definitions (MCP format)
// ============================================================

export const TOOLS = [
  {
    name: "search_pages",
    description: "Search NotePM pages. Can filter by keyword, note, or tag.",
    inputSchema: toInputSchema(SearchPagesInputSchema),
  },
  {
    name: "get_page",
    description: "Get a NotePM page. Retrieve title, body, tags and other details by page code.",
    inputSchema: toInputSchema(GetPageInputSchema),
  },
  {
    name: "create_page",
    description: "Create a new page in NotePM. Note code and title are required.",
    inputSchema: toInputSchema(CreatePageInputSchema),
  },
  {
    name: "update_page",
    description: "Update an existing NotePM page. Page code is required.",
    inputSchema: toInputSchema(UpdatePageInputSchema),
  },
  {
    name: "delete_page",
    description: "Delete a NotePM page. This action cannot be undone.",
    inputSchema: toInputSchema(DeletePageInputSchema),
  },
];

// ============================================================
// Tool Handlers
// ============================================================

type ToolResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

/**
 * Create a successful tool result
 */
function success(text: string): ToolResult {
  return { content: [{ type: "text", text }] };
}

/**
 * Create an error tool result
 */
function error(text: string): ToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

/**
 * Input validation error
 */
class InputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputError";
  }
}

/**
 * Parse and validate input, throw InputError on failure
 */
function parseInput<T extends z.ZodType>(schema: T, args: unknown): z.infer<T> {
  const result = schema.safeParse(args);
  if (!result.success) {
    throw new InputError(result.error.message);
  }
  return result.data;
}

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
 * Execute tool
 */
export async function handleToolCall(
  client: NotePMClient,
  name: string,
  args: unknown
): Promise<ToolResult> {
  try {
    switch (name) {
      case "search_pages": {
        const { query, note_code, tag_name, per_page } = parseInput(SearchPagesInputSchema, args);
        const result = await client.searchPages({ q: query, note_code, tag_name, per_page });

        if (result.pages.length === 0) {
          return success("Search results: 0 pages");
        }

        const pageList = result.pages
          .map(
            (p, i) =>
              `${i + 1}. **${p.title}** (code: ${p.page_code})\n   - Note: ${p.note_code} | Updated: ${p.updated_at}`
          )
          .join("\n");

        return success(`Search results: showing ${result.pages.length} of ${result.meta.total} pages\n\n${pageList}`);
      }

      case "get_page": {
        const { page_code } = parseInput(GetPageInputSchema, args);
        const page = await client.getPage(page_code);
        return success(formatPage(page));
      }

      case "create_page": {
        const { note_code, title, body, memo, tags } = parseInput(CreatePageInputSchema, args);
        const page = await client.createPage({ note_code, title, body, memo, tags });
        return success(`Page created.\n\n${formatPage(page)}`);
      }

      case "update_page": {
        const { page_code, title, body, memo, tags } = parseInput(UpdatePageInputSchema, args);
        const page = await client.updatePage(page_code, { title, body, memo, tags });
        return success(`Page updated.\n\n${formatPage(page)}`);
      }

      case "delete_page": {
        const { page_code } = parseInput(DeletePageInputSchema, args);
        await client.deletePage(page_code);
        return success(`Page deleted: ${page_code}`);
      }

      default:
        return error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    if (err instanceof InputError) {
      return error(`Input error: ${err.message}`);
    }
    if (err instanceof NotePMAPIError) {
      return error(err.message);
    }
    throw err;
  }
}
