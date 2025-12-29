# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NotePM MCP Server - An unofficial MCP (Model Context Protocol) server for NotePM, a Japanese wiki-style documentation service. This server enables Claude Desktop and Claude Code to interact with NotePM's API.

## Common Commands

```bash
# Build
npm run build

# Development (with tsx for hot reload)
npm run dev

# Run tests
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode

# Linting and formatting
npm run lint                # Check for lint errors
npm run lint:fix            # Auto-fix lint errors
npm run format              # Format code with Prettier
npm run format:check        # Check formatting
```

## Architecture

### Entry Point and Server Setup
- `src/index.ts` - MCP server initialization using `@modelcontextprotocol/sdk`. Uses stdio transport for communication.

### Shared Layer (`src/shared/`)
- `config.ts` - Loads configuration from environment variables:
  - `NOTEPM_TEAM_DOMAIN` - Team subdomain (e.g., "demo" → demo.notepm.jp)
  - `NOTEPM_ACCESS_TOKEN` - API access token
- `http-client.ts` - Base HTTP client for NotePM REST API
- `errors.ts` - Custom error classes (`NotePMAPIError`, `InputError`)
- `schema-utils.ts` - Zod to JSON Schema conversion utilities
- `types.ts` - Shared types (`User`, `Tag`, `PaginationMeta`)
- `result.ts` - Result builder utilities for MCP responses

### MCP Layer (`src/mcp/`)
- `tools.ts` - Aggregates all domain tools into a single list
- `handler.ts` - Routes tool calls to appropriate domain handlers

### Domain Modules
Each domain follows a consistent structure:

```
src/{domain}/
├── types.ts     # Domain types and tool name constants
├── schemas.ts   # Zod input schemas (single source of truth)
├── client.ts    # HTTP client methods for the domain
├── handlers.ts  # Tool execution logic
├── tools.ts     # MCP tool definitions
└── index.ts     # Public API re-exports
```

Domains: `folders/`, `notes/`, `pages/`, `tags/`

### Available MCP Tools

| Domain | Tool | Description |
|--------|------|-------------|
| Folders | `list_folders` | List folders in a note |
| Notes | `list_notes` | List all notes |
| Pages | `search_pages` | Search pages by keyword, note, or tag |
| Pages | `get_page` | Get page details by page code |
| Pages | `create_page` | Create a new page |
| Pages | `update_page` | Update an existing page |
| Tags | `list_tags` | List all tags |
| Tags | `create_tag` | Create a new tag |

## Key Patterns

### Type Safety
- Zod schemas in `schemas.ts` are the single source of truth
- Types are inferred from schemas using `z.infer<typeof Schema>`
- Tool names use `as const` for literal types

### Error Handling
- `NotePMAPIError` for API errors (includes status code)
- `InputError` for validation errors
- Both are caught in `handleToolCall` and returned as error results
