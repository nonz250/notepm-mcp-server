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

### Configuration
- `src/config.ts` - Loads configuration from environment variables:
  - `NOTEPM_TEAM_DOMAIN` - Team subdomain (e.g., "demo" → demo.notepm.jp)
  - `NOTEPM_ACCESS_TOKEN` - API access token

### API Client
- `src/notepm-client.ts` - HTTP client for NotePM REST API (`https://{domain}.notepm.jp/api/v1`). Handles Notes and Pages CRUD operations.

### Tools Layer (`src/tools/`)
The tools layer follows a clean separation pattern:
- `constants.ts` - Tool name constants with TypeScript const assertion for type safety
- `schemas.ts` - Zod schemas for input validation (single source of truth for types)
- `definitions.ts` - MCP tool definitions with JSON Schema conversion from Zod
- `handlers.ts` - Tool execution logic with structured error handling
- `index.ts` - Public API re-exports

### Available MCP Tools
- `search_pages` - Search pages by keyword, note, or tag
- `get_page` - Get page details by page code
- `create_page` - Create a new page
- `update_page` - Update an existing page
- `delete_page` - Delete a page
- `list_notes` - List all notes

## Key Patterns

### Type Safety
- Zod schemas in `schemas.ts` are the single source of truth
- Types are inferred from schemas using `z.infer<typeof Schema>`
- Tool names use `as const` for literal types

### Error Handling
- `NotePMAPIError` for API errors (includes status code)
- `InputError` for validation errors
- Both are caught in `handleToolCall` and returned as error results
