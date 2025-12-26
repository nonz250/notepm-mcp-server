#!/usr/bin/env node

/**
 * NotePM MCP Server
 *
 * NotePM API と連携する MCP サーバー
 * Claude Desktop や Claude Code から NotePM のページを検索・取得・作成できます
 *
 * 必要な環境変数:
 * - NOTEPM_TEAM_DOMAIN: チームドメイン（例: "demo"）
 * - NOTEPM_ACCESS_TOKEN: API アクセストークン
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { loadConfig } from "./config.js";
import { NotePMClient } from "./notepm-client.js";
import { TOOLS, handleToolCall } from "./tools.js";

// ============================================================
// 設定の読み込みとクライアント初期化
// ============================================================

const config = loadConfig();
const client = new NotePMClient(config);

// ============================================================
// サーバーインスタンスの作成
// ============================================================

const server = new Server(
  {
    name: "notepm-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================================
// リクエストハンドラーの設定
// ============================================================

/**
 * tools/list リクエストのハンドラー
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

/**
 * tools/call リクエストのハンドラー
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleToolCall(client, name, args);
});

// ============================================================
// サーバーの起動
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`NotePM MCP Server が起動しました (${config.teamDomain}.notepm.jp)`);
}

main().catch((error) => {
  console.error("サーバー起動エラー:", error);
  process.exit(1);
});
