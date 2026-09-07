# Claude AntiSlop 🛡️

**Eliminate AI-generated code slop before it reaches your codebase.**

Claude AntiSlop is a comprehensive quality enforcement toolkit that integrates directly into your development workflow—via CLI, GitHub Actions, MCP server, and VS Code extension—to detect and block low-effort AI-generated code patterns, typos, hallucinations, and security issues before they pollute your repository.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/claude-antislop)](https://www.npmjs.com/package/claude-antislop)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-ready-blue)](docs/GITHUB_ACTION.md)
[![MCP Server](https://img.shields.io/badge/MCP_server-available-orange)](docs/MCP.md)

## 🚀 Quick Start

```bash
# Install globally
npm install -g claude-antislop

# Run on your project
claude-antislop check ./src

# Or use as GitHub Action (see docs/GITHUB_ACTION.md)
```

## ✨ Features

- **🔍 Pattern Detection**: Identifies common AI slop patterns—placeholder comments, lazy naming, copy-paste artifacts, and hallucinated imports
- **🛠️ Multi-Modal Integration**: CLI, GitHub Actions, MCP server, VS Code extension, and watch mode for real-time feedback
- **📝 Configurable Rules**: Customize detection sensitivity via `.antisloprc` or CLI flags
- **🔒 Security-First**: Built-in security audit checks for exposed secrets, unsafe patterns, and dependency issues
- **🌐 Localization Support**: Detect non-English comments and strings that slip through AI generation
- **📊 JSON Output**: Machine-readable reports for CI/CD pipelines and custom tooling

## 📦 Installation

### npm (Recommended)

```bash
npm install -g claude-antislop
```

### pnpm

```bash
pnpm add -g claude-antislop
```

### From Source

```bash
git clone https://github.com/mednabouli/claude-antislop
cd claude-antislop
pnpm install
pnpm build
```

See [INSTALL.md](docs/INSTALL.md) for detailed setup instructions, including shell completion and system requirements.

## 🎯 Usage

### CLI Commands

```bash
# Check a directory
claude-antislop check ./src

# Check with custom config
claude-antislop check ./src --config .antisloprc.json

# Output as JSON
claude-antislop check ./src --output json

# Watch mode for real-time feedback
claude-antislop watch ./src

# Run the interactive wizard
claude-antislop wizard
```

Full CLI reference: [docs/CLI.md](docs/CLI.md)

### GitHub Actions

Add to your workflow:

```yaml
- name: Run AntiSlop Check
  uses: mednabouli/claude-antislop@main
  with:
    path: ./src
    fail-on-error: true
```

See [docs/GITHUB_ACTION.md](docs/GITHUB_ACTION.md) for configuration options.

### MCP Server

Integrate with AI coding assistants:

```bash
npx -y @anthropic-ai/claude-code
# Then add claude-antislop MCP server in your Claude Code config
```

See [docs/MCP.md](docs/MCP.md) for setup.

### VS Code Extension

Get inline warnings as you code. Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mednabouli.claude-antislop) or see [docs/VSCODE_EXTENSION.md](docs/VSCODE_EXTENSION.md).

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Installation](docs/INSTALL.md) | Full setup guide, shell completion, system requirements |
| [CLI Reference](docs/CLI.md) | All commands, flags, and examples |
| [Usage Guide](docs/USAGE.md) | Best practices, config options, real-world examples |
| [GitHub Actions](docs/GITHUB_ACTION.md) | CI/CD integration setup |
| [MCP Server](docs/MCP.md) | AI assistant integration |
| [VS Code Extension](docs/VSCODE_EXTENSION.md) | IDE setup and usage |
| [Watch Mode](docs/WATCH_MODE.md) | Real-time file monitoring |
| [Wizard](docs/WIZARD.md) | Interactive setup and configuration |
| [JSON Output](docs/JSON_OUTPUT.md) | Machine-readable reports for automation |
| [Shell Completion](docs/SHELL_COMPLETION.md) | Bash, zsh, fish tab completion |
| [Localization](docs/LOCALIZATION.md) | Multi-language support and detection |
| [Security Audit](docs/SECURITY.md) | Security scanning features |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and solutions |
| [Contributing](docs/CONTRIBUTING.md) | How to contribute to the project |

## 🏗️ Project Structure

```
claude-antislop/
├── cli/              # Command-line interface
├── mcp/              # MCP server implementation
├── vscode-extension/ # VS Code extension
├── rules/            # Detection rule definitions
├── templates/        # Config and report templates
├── tests/            # Test suite
└── docs/             # Documentation
```

## ⚙️ Configuration

Create `.antisloprc.json` in your project root:

```json
{
  "rules": {
    "no-placeholder-comments": "error",
    "no-lazy-naming": "warn",
    "no-hallucinated-imports": "error",
    "no-copy-paste-artifacts": "warn"
  },
  "exclude": ["**/*.test.ts", "**/node_modules/**"],
  "output": "text",
  "failOnError": true
}
```

See [docs/USAGE.md](docs/USAGE.md) for all configuration options.

## 🧪 Example Output

```
❌ src/utils/helpers.ts:24:5
   [ERROR] Placeholder comment detected: "TODO: implement this"
   [WARN] Lazy variable name: data1, data2

❌ src/api/client.ts:108:1
   [ERROR] Hallucinated import: import { nonExistentFunction } from 'lodash'

Found 3 issues (2 errors, 1 warning) in 47 files
```

## 🤝 Contributing

We welcome contributions! See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for:

- Development setup
- Adding new detection rules
- Submitting PRs
- Reporting bugs and feature requests

## 🔒 Security

This project includes built-in security auditing. See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) and [docs/SECURITY.md](docs/SECURITY.md) for details.

To report a security vulnerability, see our [Security Policy](docs/SECURITY.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built to combat the rising tide of AI-generated code slop. Inspired by real-world code review pain points and the need for automated quality gates in AI-assisted development.

---

**Maintained by** [@mednabouli](https://github.com/mednabouli) | [Report an Issue](https://github.com/mednabouli/claude-antislop/issues)
