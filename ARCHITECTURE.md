# Architecture

This document provides a technical deep dive into Claude AntiSlop's architecture, designed for contributors and advanced users.

## Overview

Claude AntiSlop is a monorepo built with pnpm workspaces, consisting of four main packages:

```
claude-antislop/
├── cli/              # Command-line interface (TypeScript)
├── mcp/              # MCP server for AI assistant integration
├── vscode-extension/ # VS Code extension
├── rules/            # Detection rule definitions
├── templates/        # Config schemas and report templates
└── tests/            # Integration and unit tests
```

## Core Components

### 1. CLI (`cli/`)

The CLI is the primary entry point, built with Commander.js. It orchestrates:

- **File Discovery**: Recursively scans directories for target files (`.ts`, `.tsx`, `.js`, `.jsx`)
- **Rule Engine**: Applies detection rules to each file
- **Output Formatters**: Text, JSON, or custom formatters
- **Watch Mode**: File system watcher for real-time feedback
- **Wizard**: Interactive setup assistant

**Key Files:**
- `cli/src/index.ts` – Main entry point
- `cli/src/commands/check.ts` – Check command implementation
- `cli/src/commands/watch.ts` – Watch mode implementation
- `cli/src/commands/wizard.ts` – Interactive wizard

### 2. Rules Engine (`rules/`)

The rules engine is the core detection logic:

**Rule Types:**
- **Pattern Rules**: Regex-based detection (e.g., placeholder comments)
- **AST Rules**: TypeScript/JavaScript AST analysis (e.g., lazy naming, complexity)
- **Import Rules**: Module resolution validation (e.g., hallucinated imports)
- **Security Rules**: Secret detection, unsafe patterns
- **Localization Rules**: Non-English text detection

**Rule Structure:**
```typescript
interface Rule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warn' | 'off';
  category: 'slop' | 'security' | 'localization' | 'style';
  check: (file: File) => Diagnostic[];
}
```

**Key Files:**
- `rules/src/index.ts` – Rule registry
- `rules/src/patterns/` – Regex-based rules
- `rules/src/ast/` – AST-based rules
- `rules/src/security/` – Security checks

### 3. MCP Server (`mcp/`)

The MCP (Model Context Protocol) server enables AI assistant integration:

**Features:**
- Exposes AntiSlop rules as MCP tools
- Real-time code analysis for AI coding assistants
- Configuration management
- Diagnostic reporting

**Key Files:**
- `mcp/src/index.ts` – MCP server entry
- `mcp/src/tools/check.ts` – Check tool implementation
- `mcp/src/tools/analyze.ts` – Deep analysis tool

### 4. VS Code Extension (`vscode-extension/`)

Provides inline IDE feedback:

**Features:**
- Real-time diagnostics as you type
- Quick fixes for common issues
- Status bar integration
- Command palette actions

**Key Files:**
- `vscode-extension/src/extension.ts` – Extension entry
- `vscode-extension/src/diagnostics.ts` – Diagnostic provider
- `vscode-extension/src/commands.ts` – Command registrations

## Data Flow

```
File System
    ↓
[File Discovery] → Filter by include/exclude patterns
    ↓
[Parser] → TypeScript/JavaScript AST
    ↓
[Rule Engine] → Apply all enabled rules
    ↓
[Diagnostic Collection] → Aggregate results
    ↓
[Output Formatter] → Text, JSON, or IDE integration
    ↓
[Exit Code] → 0 (pass) or 1 (fail)
```

## Configuration Resolution

Configuration is resolved in this order (highest to lowest priority):

1. CLI flags (e.g., `--config`, `--output`)
2. `.antisloprc.json` in project root
3. `.antisloprc` (no extension)
4. `antisloprc` field in `package.json`
5. Default configuration

## Performance Optimizations

- **Parallel Processing**: Files are processed in parallel using worker threads
- **Incremental Checks**: Watch mode only re-checks changed files
- **AST Caching**: Parsed ASTs are cached for rules that need them
- **Rule Short-Circuiting**: Rules can skip files based on metadata

## Security Model

- **No Network Calls**: All analysis is local
- **Safe Regex**: All regex patterns are validated and bounded
- **Sandboxed Execution**: Rules run in isolated contexts
- **Secret Handling**: Detected secrets are redacted in output

## Extensibility

### Adding New Rules

1. Create rule file in `rules/src/patterns/` or `rules/src/ast/`
2. Implement `Rule` interface
3. Register in `rules/src/index.ts`
4. Add tests in `tests/rules/`
5. Document in `docs/`

### Adding New Output Formats

1. Create formatter in `cli/src/formatters/`
2. Implement `Formatter` interface
3. Register in `cli/src/index.ts`
4. Add to CLI flags

## Testing Strategy

- **Unit Tests**: Individual rule tests with fixture files
- **Integration Tests**: Full CLI workflow tests
- **E2E Tests**: Real-world codebase scans
- **Performance Tests**: Benchmark on large repositories

## Build & Release

```bash
# Development
pnpm install
pnpm build
pnpm dev

# Testing
pnpm test
pnpm test:coverage

# Release
pnpm version patch  # or minor, major
pnpm publish
```

## Dependencies

**Core:**
- `commander` – CLI framework
- `typescript` – TypeScript compiler API
- `@typescript-eslint/parser` – AST parsing
- `chokidar` – File watching
- `jsonschema` – Config validation

**Development:**
- `vitest` – Testing framework
- `eslint` – Code quality
- `prettier` – Code formatting

## Future Architecture Plans

- **Plugin System**: Allow third-party rules
- **Language Support**: Python, Go, Rust
- **Cloud Integration**: Remote rule execution
- **AI-Powered Suggestions**: Auto-fix recommendations
- **Performance Dashboard**: Analytics on code quality trends

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## Questions?

Open an issue or discussion on GitHub for architecture questions.
