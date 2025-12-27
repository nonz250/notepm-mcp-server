# notepm-mcp-server

<p align="center">
  <img src="https://help.notepm.jp/hc/article_attachments/44087166436121" alt="NotePM" width="200">
</p>

<p align="center">
  <strong>⚠️ UNOFFICIAL - This is NOT an official NotePM product ⚠️</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nonz250/notepm-mcp-server"><img src="https://img.shields.io/npm/v/@nonz250/notepm-mcp-server" alt="npm version"></a>
  <a href="https://github.com/nonz250/notepm-mcp-server/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@nonz250/notepm-mcp-server" alt="license"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/node/v/@nonz250/notepm-mcp-server" alt="node"></a>
  <a href="https://github.com/nonz250/notepm-mcp-server/actions/workflows/ci.yml"><img src="https://github.com/nonz250/notepm-mcp-server/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript"></a>
</p>

---

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
| `list_notes` | List all notes in your workspace |
| `get_note` | Get a note's details including name, description, and scope |
| `create_note` | Create a new note with name, description, and access settings |
| `update_note` | Update an existing note's name, description, or access settings |
| `delete_note` | Delete a note and all its pages (irreversible) |
| `archive_note` | Archive a note (hidden from default list but can be restored) |
| `unarchive_note` | Restore an archived note back to the active list |
| `search_pages` | Search pages by keyword, note, or tag |
| `get_page` | Get a page's full content including title, body, and tags |
| `create_page` | Create a new page in a specified note |
| `update_page` | Update an existing page's content |
| `delete_page` | Delete a page (irreversible) |
| `list_tags` | List all tags in your workspace |
| `create_tag` | Create a new tag |
| `delete_tag` | Delete a tag (irreversible) |

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

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
