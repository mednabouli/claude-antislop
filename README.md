# Claude Anti-Slop

> Local-first, per-developer quality layer that never touches your repo config.

**Claude Anti-Slop** is a developer productivity toolkit that runs entirely on your machine. It provides intelligent code analysis, pattern detection, and quality enforcement through a polished CLI and MCP (Model Context Protocol) integration with Claude Code.

## Features

### 🔍 Smart Memory Search
- **Fuzzy matching** for better recall (finds "TypeSript" when searching for "TypeScript")
- **Relevance scoring** (0-100%) with category filtering
- **5 categories**: standards, patterns, anti-patterns, insights, reviews
- **Append/create modes** for flexible memory management

### 📊 Code Quality Checks
- **ESLint** integration for linting
- **TypeScript** type checking
- **Prettier** formatting validation
- **Auto-fix suggestions** with one-command fixes
- **Temp file cleanup** with guaranteed cleanup on errors

### 📈 Repository Analysis
- **Full scan integration** with template generation
- **Pattern detection** across 10 commit types:
  - Conventional commits
  - Feature development
  - Bug fixes
  - Refactoring
  - Documentation
  - Performance improvements
  - Testing
  - Security improvements
  - Dependency updates
  - Hotfixes

### 🎯 Git Learning
- **Lesson extraction** from commit history
- **Pattern detection** with confidence scoring
- **Insight generation** for development practices
- **Actionable recommendations** based on detected patterns

### 💻 Polished CLI
- **Consistent terminal UI** with ANSI colors
- **Spinners and progress indicators**
- **Compact tables** for diagnostics
- **Human-readable output** (file sizes, durations)
- **NO_COLOR support** for CI/CD environments

## Installation

```bash
# Clone the repository
git clone https://github.com/mednabouli/claude-antislop.git
cd claude-antislop

# Install dependencies
npm install

# Install the CLI globally (optional)
npm install -g .

# Or run locally
npx claude-antislop --help
```

### Quick Start

```bash
# Initialize memory (optional)
claude-antislop install --init-memory

# Check status
claude-antislop status

# Personalize with your repo
claude-antislop scan --repo <your-repo>

# Learn from git history
claude-antislop learn-from-git --recent 30d
```

## Usage

### CLI Commands

| Command | Description |
|---------|-------------|
| `install` | Install the plugin with optional memory initialization |
| `status` | Show plugin status and diagnostics |
| `scan` | Scan a repository and generate templates |
| `learn-from-git` | Learn from git history and extract patterns |
| `memory-search` | Search memory with fuzzy matching |
| `memory-write` | Write to memory with append/create modes |
| `code-quality-check` | Run ESLint, TypeScript, and Prettier checks |

### Examples

```bash
# Search memory with fuzzy matching
claude-antislop memory-search --query "TypeScript strict mode" --category standards

# Write to memory
claude-antislop memory-write --category patterns --filename "react-patterns.md" --content "..."

# Check code quality
claude-antislop code-quality-check --code "const x = 1" --language typescript --checks lint,typecheck,prettier

# Learn from git
claude-antislop learn-from-git --repo ./my-project --recent 30d
```

### MCP Integration

Claude Anti-Slop integrates with Claude Code via MCP (Model Context Protocol). Add to your MCP configuration:

```json
{
  "mcpServers": {
    "claude-antislop": {
      "command": "claude-antislop",
      "args": ["mcp-server"]
    }
  }
}
```

## Architecture

```
claude-antislop/
├── cli/                    # Command-line interface
│   ├── index.mjs          # Main entry point
│   ├── lib/               # CLI libraries
│   │   ├── ui.mjs         # Terminal UI utilities
│   │   ├── install.mjs    # Installation logic
│   │   ├── status.mjs     # Status diagnostics
│   │   ├── scan.mjs       # Repository scanning
│   │   ├── learn.mjs      # Git learning
│   │   └── memory.mjs     # Memory management
│   └── commands/          # CLI commands
├── mcp/                   # MCP server implementation
│   ├── mcp-server-index.mjs
│   └── tools/             # MCP tools
│       ├── memory-search.mjs
│       ├── memory-write.mjs
│       ├── code-quality-check.mjs
│       ├── scan-repo.mjs
│       └── learn-from-git.mjs
├── plugin/                # Claude Code plugin
│   └── plugin.json
├── rules/                 # Quality rules (149 rules, 12 categories)
├── templates/             # Generated templates (10 standards/patterns)
├── tests/                 # Test suite (56 tests, 85%+ coverage)
└── docs/                  # Documentation
```

## System Requirements

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** 2.0.0 or higher (for git learning features)
- **ESLint** (optional, for code quality checks)
- **TypeScript** (optional, for type checking)
- **Prettier** (optional, for formatting checks)
- **Claude Code** (optional, for MCP integration)

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/memory-search.test.mjs
```

### Test Coverage

- **56 tests** covering CLI, MCP tools, and utilities
- **85%+ code coverage** across all modules
- **Integration tests** for end-to-end flows
- **Unit tests** for individual functions

## Security & Privacy

- **Local-first**: All data stays on your machine
- **No repo config**: Never modifies your repository configuration
- **Per-developer**: Each developer has their own memory and settings
- **No telemetry**: No data collection or analytics
- **Open source**: Full transparency of all operations

### Security Features

- **Path traversal protection**: Blocks `../` and symlink attacks
- **Command injection prevention**: Safe argument handling
- **Temp file cleanup**: Guaranteed cleanup on errors
- **Input validation**: Strict category and filename validation
- **Error handling**: Graceful degradation on failures

## Documentation

- **[INSTALL.md](docs/INSTALL.md)** - Detailed installation guide
- **[USAGE.md](docs/USAGE.md)** - Complete usage documentation
- **[MCP.md](docs/MCP.md)** - MCP server documentation
- **[CLI.md](docs/CLI.md)** - CLI command reference
- **[SECURITY.md](docs/SECURITY.md)** - Security policy
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines

## Development

```bash
# Clone and setup
git clone https://github.com/mednabouli/claude-antislop.git
cd claude-antislop
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Type check
npm run typecheck
```

### Project Structure

- **`cli/`** - Command-line interface implementation
- **`mcp/`** - MCP server and tools
- **`plugin/`** - Claude Code plugin configuration
- **`rules/`** - Quality rules and standards
- **`templates/`** - Generated templates
- **`tests/`** - Test suite
- **`docs/`** - Documentation

## Roadmap

### Completed (v1.0)
- ✅ 149 rules across 12 categories
- ✅ 10 standards/patterns files
- ✅ 11 CLI commands with error handling
- ✅ 5 MCP tools with fuzzy search, prettier checks, 10 pattern types
- ✅ Polished CLI output with consistent colors, spinners, tables
- ✅ 56 tests (85%+ coverage)
- ✅ Security & privacy policies
- ✅ Complete documentation

### Planned (v1.1)
- 🔲 Shell completion (`bash`, `zsh`, `fish`)
- 🔲 Interactive first-run wizard
- 🔲 Automatic update notifications
- 🔲 JSON output mode for automation (`--json`)
- 🔲 Localized CLI messages

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Med** ([@mednabouli](https://github.com/mednabouli))

- **Blog**: [mednabouli.me](https://mednabouli.me)
- **Location**: Montreal
- **Company**: [@mednabouli](https://github.com/mednabouli)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

- **Issues**: [GitHub Issues](https://github.com/mednabouli/claude-antislop/issues)
- **Documentation**: [docs/](docs/)
- **FAQ**: [docs/FAQ.md](docs/FAQ.md)

---

**Built with ❤️ in Montreal**
