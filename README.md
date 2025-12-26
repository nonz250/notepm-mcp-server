# notepm-mcp-server

[![npm version](https://img.shields.io/npm/v/@nonz250/notepm-mcp-server)](https://www.npmjs.com/package/@nonz250/notepm-mcp-server)
[![license](https://img.shields.io/npm/l/@nonz250/notepm-mcp-server)](https://github.com/nonz250/notepm-mcp-server/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/@nonz250/notepm-mcp-server)](https://nodejs.org/)
[![CI](https://github.com/nonz250/notepm-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/nonz250/notepm-mcp-server/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

An unofficial [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for [NotePM](https://notepm.jp/) - a knowledge management and documentation platform.

This server enables AI assistants like Claude to search, read, create, update, and delete pages in your NotePM workspace.

## Requirements

- Node.js >= 22

## Installation

### Using npx (Recommended)

No installation required. Configure your MCP client to run the server directly with `npx`.

### Global Installation

```bash
npm install -g @nonz250/notepm-mcp-server
```

## Configuration

### Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "notepm": {
      "command": "npx",
      "args": ["-y", "@nonz250/notepm-mcp-server"],
      "env": {
        "NOTEPM_TEAM_DOMAIN": "your-team-domain",
        "NOTEPM_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

### Claude Code

#### Using CLI

```bash
claude mcp add notepm \
  --env NOTEPM_TEAM_DOMAIN=your-team-domain \
  --env NOTEPM_ACCESS_TOKEN=your-access-token \
  -- npx -y @nonz250/notepm-mcp-server
```

#### Using settings file

Add the following to your Claude Code settings file (`.claude/settings.json` or `.claude/settings.local.json`):

```json
{
  "mcpServers": {
    "notepm": {
      "command": "npx",
      "args": ["-y", "@nonz250/notepm-mcp-server"],
      "env": {
        "NOTEPM_TEAM_DOMAIN": "your-team-domain",
        "NOTEPM_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

### Using Global Installation

If you installed globally, replace `npx` with the direct command:

```json
{
  "mcpServers": {
    "notepm": {
      "command": "notepm-mcp-server",
      "env": {
        "NOTEPM_TEAM_DOMAIN": "your-team-domain",
        "NOTEPM_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `search_pages` | Search NotePM pages by keyword, note, or tag |
| `get_page` | Get a page's full content including title, body, and tags |
| `create_page` | Create a new page in a specified note |
| `update_page` | Update an existing page's content |
| `delete_page` | Delete a page (irreversible) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTEPM_TEAM_DOMAIN` | Yes | Your NotePM team domain (e.g., `demo` for `demo.notepm.jp`) |
| `NOTEPM_ACCESS_TOKEN` | Yes | API access token from NotePM |

## Getting an Access Token

1. Log in to your NotePM workspace
2. Go to **Personal Settings** > **Access Token**
3. Generate a new access token
4. Copy the token and use it in your configuration

## Development

### Using MCP Server Locally

When developing this package, `npx @nonz250/notepm-mcp-server` won't work from within the project directory. Use the local build instead:

```bash
claude mcp add notepm \
  --env NOTEPM_TEAM_DOMAIN=your-team-domain \
  --env NOTEPM_ACCESS_TOKEN=your-access-token \
  -- npm run start --prefix /path/to/notepm-mcp-server
```

### Setup

```bash
git clone https://github.com/nonz250/notepm-mcp-server.git
cd notepm-mcp-server
npm install
npm run build
```

### Running Locally

```bash
NOTEPM_TEAM_DOMAIN=your-team NOTEPM_ACCESS_TOKEN=your-token npm run start
```

### Running Tests

```bash
npm test
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## License

MIT
