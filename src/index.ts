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

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { loadConfig } from "./config.js";
import { NotePMClient } from "./notepm-client.js";
import { TOOLS, handleToolCall } from "./tools/index.js";

// ============================================================
// Load configuration and initialize client
// ============================================================

const config = loadConfig();
const client = new NotePMClient(config);

// ============================================================
// Create server instance
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
// Set up request handlers
// ============================================================

/**
 * Handler for tools/list request
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

/**
 * Handler for tools/call request
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return handleToolCall(client, name, args);
});

// ============================================================
// Start server
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`NotePM MCP Server started (${config.teamDomain}.notepm.jp)`);
}

main().catch((error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});
