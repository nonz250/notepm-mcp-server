/**
 * MCP ツール定義
 *
 * NotePM API と連携する MCP ツールを定義
 */

import { z } from "zod";
import { NotePMClient, NotePMAPIError, Page } from "./notepm-client.js";

// ============================================================
// 入力スキーマ定義（Zod）
// ============================================================

export const SearchPagesInputSchema = z.object({
  query: z.string().optional().describe("検索キーワード"),
  note_code: z.string().optional().describe("ノートコード（特定のノート内を検索）"),
  tag_name: z.string().optional().describe("タグ名でフィルタ"),
  per_page: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe("取得件数（1-100、デフォルト: 20）"),
});

export const GetPageInputSchema = z.object({
  page_code: z.string().describe("ページコード"),
});

export const CreatePageInputSchema = z.object({
  note_code: z.string().describe("ページを作成するノートのコード"),
  title: z.string().max(100).describe("ページタイトル（最大100文字）"),
  body: z.string().optional().describe("ページ本文（Markdown形式）"),
  memo: z.string().max(255).optional().describe("メモ（最大255文字）"),
  tags: z.array(z.string()).optional().describe("タグの配列"),
});

// ============================================================
// ツール定義（MCP 形式）
// ============================================================

export const TOOLS = [
  {
    name: "search_pages",
    description:
      "NotePM のページを検索します。キーワード、ノート、タグで絞り込みが可能です。",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "検索キーワード",
        },
        note_code: {
          type: "string",
          description: "ノートコード（特定のノート内を検索）",
        },
        tag_name: {
          type: "string",
          description: "タグ名でフィルタ",
        },
        per_page: {
          type: "number",
          description: "取得件数（1-100、デフォルト: 20）",
          default: 20,
        },
      },
    },
  },
  {
    name: "get_page",
    description:
      "NotePM のページを取得します。ページコードを指定して、タイトル・本文・タグなどの詳細情報を取得します。",
    inputSchema: {
      type: "object" as const,
      properties: {
        page_code: {
          type: "string",
          description: "ページコード",
        },
      },
      required: ["page_code"],
    },
  },
  {
    name: "create_page",
    description:
      "NotePM に新しいページを作成します。ノートコードとタイトルは必須です。",
    inputSchema: {
      type: "object" as const,
      properties: {
        note_code: {
          type: "string",
          description: "ページを作成するノートのコード",
        },
        title: {
          type: "string",
          description: "ページタイトル（最大100文字）",
        },
        body: {
          type: "string",
          description: "ページ本文（Markdown形式）",
        },
        memo: {
          type: "string",
          description: "メモ（最大255文字）",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "タグの配列",
        },
      },
      required: ["note_code", "title"],
    },
  },
];

// ============================================================
// ツールハンドラー
// ============================================================

/**
 * ページ情報をフォーマット
 */
function formatPage(page: Page): string {
  const tags = page.tags.map((t) => t.name).join(", ") || "なし";
  return [
    `## ${page.title}`,
    `- ページコード: ${page.page_code}`,
    `- ノートコード: ${page.note_code}`,
    `- 作成者: ${page.created_by.name}`,
    `- 作成日時: ${page.created_at}`,
    `- 更新日時: ${page.updated_at}`,
    `- タグ: ${tags}`,
    "",
    "### 本文",
    page.body || "(本文なし)",
  ].join("\n");
}

/**
 * ツールを実行
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
            content: [{ type: "text", text: `入力エラー: ${parsed.error.message}` }],
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
            content: [{ type: "text", text: "検索結果: 0件" }],
          };
        }

        const pageList = result.pages
          .map(
            (p, i) =>
              `${i + 1}. **${p.title}** (コード: ${p.page_code})\n   - ノート: ${p.note_code} | 更新: ${p.updated_at}`
          )
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `検索結果: ${result.meta.total}件中 ${result.pages.length}件を表示\n\n${pageList}`,
            },
          ],
        };
      }

      case "get_page": {
        const parsed = GetPageInputSchema.safeParse(args);
        if (!parsed.success) {
          return {
            content: [{ type: "text", text: `入力エラー: ${parsed.error.message}` }],
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
            content: [{ type: "text", text: `入力エラー: ${parsed.error.message}` }],
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
              text: `ページを作成しました。\n\n${formatPage(page)}`,
            },
          ],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `不明なツール: ${name}` }],
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
