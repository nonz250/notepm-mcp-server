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

// ============================================================
// Tool Definitions (MCP format)
// ============================================================

export const TOOLS = [
  {
    name: "search_pages",
    description:
      "Search NotePM pages. Can filter by keyword, note, or tag.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search keyword",
        },
        note_code: {
          type: "string",
          description: "Note code (search within specific note)",
        },
        tag_name: {
          type: "string",
          description: "Filter by tag name",
        },
        per_page: {
          type: "number",
          description: "Number of results (1-100, default: 20)",
          default: 20,
        },
      },
    },
  },
  {
    name: "get_page",
    description:
      "Get a NotePM page. Retrieve title, body, tags and other details by page code.",
    inputSchema: {
      type: "object" as const,
      properties: {
        page_code: {
          type: "string",
          description: "Page code",
        },
      },
      required: ["page_code"],
    },
  },
  {
    name: "create_page",
    description:
      "Create a new page in NotePM. Note code and title are required.",
    inputSchema: {
      type: "object" as const,
      properties: {
        note_code: {
          type: "string",
          description: "Note code to create page in",
        },
        title: {
          type: "string",
          description: "Page title (max 100 characters)",
        },
        body: {
          type: "string",
          description: "Page body (Markdown format)",
        },
        memo: {
          type: "string",
          description: "Memo (max 255 characters)",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Array of tags",
        },
      },
      required: ["note_code", "title"],
    },
  },
];

// ============================================================
// Tool Handlers
// ============================================================

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
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    switch (name) {
      case "search_pages": {
        const parsed = SearchPagesInputSchema.safeParse(args);
        if (!parsed.success) {
          return {
            content: [{ type: "text", text: `Input error: ${parsed.error.message}` }],
            isError: true,
          };
        }

        const { query, note_code, tag_name, per_page } = parsed.data;
        const result = await client.searchPages({
          q: query,
          note_code,
          tag_name,
          per_page,
        });

        if (result.pages.length === 0) {
          return {
            content: [{ type: "text", text: "Search results: 0 pages" }],
          };
        }

        const pageList = result.pages
          .map(
            (p, i) =>
              `${i + 1}. **${p.title}** (code: ${p.page_code})\n   - Note: ${p.note_code} | Updated: ${p.updated_at}`
          )
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `Search results: showing ${result.pages.length} of ${result.meta.total} pages\n\n${pageList}`,
            },
          ],
        };
      }

      case "get_page": {
        const parsed = GetPageInputSchema.safeParse(args);
        if (!parsed.success) {
          return {
            content: [{ type: "text", text: `Input error: ${parsed.error.message}` }],
            isError: true,
          };
        }

        const page = await client.getPage(parsed.data.page_code);
        return {
          content: [{ type: "text", text: formatPage(page) }],
        };
      }

      case "create_page": {
        const parsed = CreatePageInputSchema.safeParse(args);
        if (!parsed.success) {
          return {
            content: [{ type: "text", text: `Input error: ${parsed.error.message}` }],
            isError: true,
          };
        }

        const { note_code, title, body, memo, tags } = parsed.data;
        const page = await client.createPage({
          note_code,
          title,
          body,
          memo,
          tags,
        });

        return {
          content: [
            {
              type: "text",
              text: `Page created.\n\n${formatPage(page)}`,
            },
          ],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    if (error instanceof NotePMAPIError) {
      return {
        content: [{ type: "text", text: error.message }],
        isError: true,
      };
    }
    throw error;
  }
}
