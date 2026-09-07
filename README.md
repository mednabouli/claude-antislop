# Claude Anti-Slop 🚀

**Local-first, per-developer quality layer that never touches your repo config.**

Claude Anti-Slop is your personal code quality assistant that lives in your terminal. It learns from your codebase, enforces standards, and helps you write better code - all without requiring any changes to your repository.

## ✨ Features

- 🔌 **Zero-config installation** - Works without modifying repo files
- 🧠 **Smart memory** - Learns from your Git history and code patterns
- 🌍 **Multi-language** - English, French, Spanish, German, Chinese, Japanese
- 🐚 **Shell completions** - Bash, Zsh, and Fish support
- 🤖 **Automation-ready** - JSON output mode for scripting
- 🎯 **Standards enforcement** - Lint, typecheck, and prettier checks
- 📊 **MCP integration** - Works with Claude Code and other MCP clients

## 🚀 Quick Start

```bash
# Install globally
npm install -g claude-antislop

# Run the interactive setup wizard
claude-antislop wizard

# Check status
claude-antislop status

# Scan your repository
claude-antislop scan --repo ./my-project
```

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Installation](docs/INSTALL.md) | Full installation guide |
| [Usage](docs/USAGE.md) | Command reference and examples |
| [CLI Reference](docs/CLI.md) | Complete CLI documentation |
| [Shell Completion](docs/SHELL_COMPLETION.md) | Bash, Zsh, Fish setup |
| [First-Run Wizard](docs/WIZARD.md) | Interactive setup guide |
| [JSON Output](docs/JSON_OUTPUT.md) | Automation and scripting |
| [Localization](docs/LOCALIZATION.md) | Multi-language support |
| [MCP Server](docs/MCP.md) | MCP integration guide |

## 🛠️ Commands

### Core Commands

```bash
# Install the plugin
claude-antislop install --init-memory

# Check plugin status
claude-antislop status

# Scan a repository
claude-antislop scan --repo ./my-project --output ./templates

# Learn from Git history
claude-antislop learn-from-git --repo . --recent 30d
```

### Memory Management

```bash
# Initialize memory directories
claude-antislop init-memory

# Search memory
claude-antislop memory-search --query "error handling" --limit 5

# Write to memory
claude-antislop memory-write --category standards --filename testing.md --content "..."
```

### Code Quality

```bash
# Run quality checks
claude-antislop code-quality-check --code "const x = 1" --language typescript
```

### MCP Server

```bash
# Start MCP server for Claude Code
claude-antislop mcp-server
```

### Shell Completion

```bash
# Print completion script
claude-antislop completion bash
claude-antislop completion zsh
claude-antislop completion fish

# Install completion
claude-antislop completion install
claude-antislop completion install zsh --path ~/.zfunc
```

### Interactive Wizard

```bash
# Run first-run setup wizard
claude-antislop wizard
```

## 🌍 Localization

Claude Anti-Slop supports 6 languages:

```bash
# Set locale per command
claude-antislop status --locale fr
claude-antislop scan --locale es
claude-antislop wizard --locale ja

# Supported locales: en, fr, es, de, zh, ja
```

## 🤖 Automation

Use `--json` for machine-readable output:

```bash
# JSON output
claude-antislop status --json
claude-antislop memory-search --query "testing" --json

# Quiet mode (exit code only)
claude-antislop status --quiet
```

### Example: Bash Script

```bash
#!/bin/bash

# Check status
status=$(claude-antislop status --json)
active=$(echo "$status" | jq -r '.data.active')

if [ "$active" != "true" ]; then
  claude-antislop init-memory
fi

# Search memory
results=$(claude-antislop memory-search --query "error handling" --json)
count=$(echo "$results" | jq -r '.data.count')

echo "Found $count error handling patterns"
```

## 📁 Project Structure

```
claude-antislop/
├── cli/                    # Command-line interface
│   ├── index.mjs          # Main CLI entry point
│   ├── lib/               # Core libraries
│   │   ├── ui.mjs         # User interface helpers
│   │   ├── output.mjs     # JSON/human output formatting
│   │   ├── i18n.mjs       # Internationalization
│   │   ├── completion.mjs # Shell completions
│   │   ├── wizard.mjs     # First-run wizard
│   │   ├── memory.mjs     # Memory management
│   │   ├── scan.mjs       # Repository scanning
│   │   ├── learn.mjs      # Git history learning
│   │   ├── quality.mjs    # Code quality checks
│   │   └── install.mjs    # Installation logic
│   └── completions/       # Shell completion scripts
│       ├── claude-antislop.bash
│       ├── _claude-antislop (zsh)
│       └── claude-antislop.fish
├── mcp/                    # MCP server
│   └── mcp-server-index.mjs
├── docs/                   # Documentation
│   ├── INSTALL.md
│   ├── USAGE.md
│   ├── CLI.md
│   ├── SHELL_COMPLETION.md
│   ├── WIZARD.md
│   ├── JSON_OUTPUT.md
│   ├── LOCALIZATION.md
│   └── MCP.md
├── index.html             # Landing page
└── package.json
```

## 🎯 Memory Categories

Claude Anti-Slop organizes knowledge into 5 categories:

- **standards/** - Coding standards and best practices
- **patterns/** - Common patterns and solutions
- **anti-patterns/** - Things to avoid
- **insights/** - Project-specific insights
- **reviews/** - Code review guidelines

## 📊 JSON Output Schema

All JSON output follows a consistent schema:

```typescript
interface Response {
  success: boolean;
  message: string;
  data: any | null;
  hint?: string | null;
  timestamp: string; // ISO 8601
}
```

## 🔧 Configuration

Configuration is stored in `~/.claude-antislop/config.json`:

```json
{
  "defaultStack": ["nextjs"],
  "locales": ["en"],
  "features": {
    "learnFromGit": true,
    "autoUpdateMemory": false,
    "reviewMode": true
  }
}
```

## 🌐 MCP Integration

Claude Anti-Slop includes an MCP server for integration with Claude Code and other MCP clients:

```bash
# Start MCP server
claude-antislop mcp-server
```

See [MCP Documentation](docs/MCP.md) for details.

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 🙏 Acknowledgments

Built with ❤️ for developers who care about code quality.
