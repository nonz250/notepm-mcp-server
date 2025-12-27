# Contributing to notepm-mcp-server

Thank you for your interest in contributing to notepm-mcp-server! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js >= 22
- npm

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

## Development Workflow

### Branch Naming

Use the following prefixes for your branches:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/add-search-filter` |
| `fix/` | Bug fixes | `fix/pagination-error` |
| `docs/` | Documentation | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/improve-types` |
| `test/` | Test additions/fixes | `test/add-handler-tests` |

### Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Use the following format:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |

**Examples:**

```
feat: add list_notes tool

fix: handle 204 No Content response from archive API

docs: update README with new tools
```

### Pull Requests

1. Create a branch from `main`
2. Make your changes
3. Run tests and lint:
   ```bash
   npm test
   npm run lint
   ```
4. Push your branch and create a PR targeting `main`
5. Ensure CI passes
6. Request a review

**PR Title:** Use the same format as commit messages (e.g., `feat: add new tool`)

**PR Description:** Include:
- Summary of changes
- Related issue (if applicable)
- Test plan

## Code Style

### Formatting

This project uses Prettier for code formatting:

```bash
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Linting

ESLint is used for code quality:

```bash
npm run lint      # Check for issues
npm run lint:fix  # Auto-fix issues
```

### TypeScript

- Use strict TypeScript
- Prefer `const` over `let`
- Use explicit return types for public functions
- Use Zod schemas for input validation

## Testing

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Run with coverage report
```

### Writing Tests

- Place tests in `src/__tests__/`
- Use descriptive test names
- Test both success and error cases
- Mock external API calls

## Reporting Issues

### Bug Reports

Please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Node.js version, OS)
- Error messages (if any)

### Feature Requests

Please include:
- Use case description
- Proposed solution (if any)
- Alternatives considered

## Questions?

If you have questions, feel free to open an issue with the `question` label.
