#!/usr/bin/env node

/**
 * NotePM MCP Server
 *
 * MCP server for NotePM API integration.
 * Enables Claude Desktop and Claude Code to search, retrieve, and create NotePM pages.
 *
 * Required environment variables:
 * - NOTEPM_TEAM_DOMAIN: Team domain (e.g., "demo")
 * - NOTEPM_ACCESS_TOKEN: API access token
 */
import { createRequire } from "node:module";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { FolderClient } from "./folders/index.js";
import { TOOLS, handleToolCall } from "./mcp/index.js";
import { NoteClient } from "./notes/index.js";
import { PageClient } from "./pages/index.js";
import { HttpClient, loadConfig } from "./shared/index.js";
import { TagClient } from "./tags/index.js";

// ============================================================
// Load package info
// ============================================================

const require = createRequire(import.meta.url);
const packageJson = require("../package.json") as { name: string; version: string };

// ============================================================
// Load configuration and initialize clients
// ============================================================

const config = loadConfig();
const httpClient = new HttpClient(config);
const clients = {
  folders: new FolderClient(httpClient),
  notes: new NoteClient(httpClient),
  pages: new PageClient(httpClient),
  tags: new TagClient(httpClient),
};

// ============================================================
// Create server instance
// ============================================================

// TODO: Consider migrating to McpServer high-level API
// Currently using Server for setRequestHandler which requires low-level API
// eslint-disable-next-line @typescript-eslint/no-deprecated
const server = new Server(
  {
    name: packageJson.name,
    version: packageJson.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================================
// Set up request handlers
// ============================================================

/**
 * Handler for tools/list request
 */
server.setRequestHandler(ListToolsRequestSchema, () => {
  return { tools: TOOLS };
});

/**
 * Handler for tools/call request
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleToolCall(clients, name, args);
});

// ============================================================
// Start server
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`NotePM MCP Server started (${config.teamDomain}.notepm.jp)`);
}

main().catch((error: unknown) => {
  console.error("Server startup error:", error);
  process.exit(1);
});
