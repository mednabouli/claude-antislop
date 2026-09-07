# Claude AntiSlop 🛡️

**Eliminate AI-generated code slop before it reaches your codebase.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/claude-antislop)](https://www.npmjs.com/package/claude-antislop)
[![npm downloads](https://img.shields.io/npm/dm/claude-antislop)](https://www.npmjs.com/package/claude-antislop)
[![GitHub stars](https://img.shields.io/github/stars/mednabouli/claude-antislop?style=flat&logo=github)](https://github.com/mednabouli/claude-antislop)
[![GitHub forks](https://img.shields.io/github/forks/mednabouli/claude-antislop?style=flat&logo=github)](https://github.com/mednabouli/claude-antislop)
[![GitHub issues](https://img.shields.io/github/issues/mednabouli/claude-antislop)](https://github.com/mednabouli/claude-antislop/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/mednabouli/claude-antislop)](https://github.com/mednabouli/claude-antislop/pulls)
[![Performance](https://img.shields.io/badge/performance-1.5s%2F1k%20files-brightgreen)](BENCHMARKS.md)
[![Rules](https://img.shields.io/badge/rules-50%2B%20detections-blue)](docs/RULES.md)

[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-ready-blue)](docs/GITHUB_ACTION.md)
[![MCP Server](https://img.shields.io/badge/MCP_server-available-orange)](docs/MCP.md)
[![VS Code](https://img.shields.io/badge/VS_Code-extension-purple)](docs/VSCODE_EXTENSION.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen)](https://nodejs.org)

Claude AntiSlop is a comprehensive quality enforcement toolkit that integrates directly into your development workflow—via CLI, GitHub Actions, MCP server, and VS Code extension—to detect and block low-effort AI-generated code patterns, typos, hallucinations, and security issues before they pollute your repository.

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

### Getting Started

| Guide | Description |
|-------|-------------|
| [Installation](docs/INSTALL.md) | Full setup guide, shell completion, system requirements |
| [Quick Start](docs/USAGE.md) | Get started in 5 minutes |
| [CLI Reference](docs/CLI.md) | All commands, flags, and examples |
| [Configuration](docs/USAGE.md#configuration) | `.antisloprc` setup and customization |

### Rules & Detection

| Guide | Description |
|-------|-------------|
| [Rules Index](docs/RULES.md) | Complete reference for 50+ detection rules |
| [Security Rules](docs/RULES.md#-security-rules) | Secrets, SQL injection, XSS, weak crypto |
| [Quality Rules](docs/RULES.md#-quality-rules) | Types, complexity, duplication |
| [Style Rules](docs/RULES.md#-style-rules) | Console, var, debugger |

### Integrations

| Guide | Description |
|-------|-------------|
| [GitHub Actions](docs/GITHUB_ACTION.md) | CI/CD integration setup |
| [MCP Server](docs/MCP.md) | AI assistant integration |
| [VS Code Extension](docs/VSCODE_EXTENSION.md) | IDE setup and usage |
| [Watch Mode](docs/WATCH_MODE.md) | Real-time file monitoring |

### Advanced Topics

| Guide | Description |
|-------|-------------|
| [Architecture](ARCHITECTURE.md) | Technical deep dive for contributors |
| [Benchmarks](BENCHMARKS.md) | Performance benchmarks and optimization |
| [Recipes](RECIPES.md) | Common workflows and integration patterns |
| [JSON Output](docs/JSON_OUTPUT.md) | Machine-readable reports |

### Contributing

| Guide | Description |
|-------|-------------|
| [Contributing](docs/CONTRIBUTING.md) | Development setup and contribution guide |
| [Adding Rules](docs/CONTRIBUTING.md#adding-new-rules) | Step-by-step rule creation |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community guidelines |
| [Security](docs/SECURITY.md) | Security policy and reporting |

## 💡 Example Projects

Real-world examples showing how to integrate AntiSlop:

### Next.js App

Complete Next.js application with TypeScript, API integration, and AntiSlop config.

```bash
cd examples/nextjs-app
npm install
npm run lint:antislop
```

**Features:** App Router, TypeScript strict mode, components, API client, error handling

[View Example →](examples/nextjs-app/README.md)

### Express API

Express.js REST API with security-focused AntiSlop configuration.

```bash
cd examples/express-api
npm install
npm run lint:antislop
```

**Features:** TypeScript ESM, Zod validation, error handling, security utilities, full CRUD

[View Example →](examples/express-api/README.md)

### Monorepo

pnpm workspace monorepo with shared types and multiple packages.

```bash
cd examples/monorepo
pnpm install
pnpm lint:antislop
```

**Features:** pnpm workspace, shared config package, Turborepo/Nx integration, package overrides

[View Example →](examples/monorepo/README.md)

### Quick Integration

```bash
# Choose your project type
cp examples/nextjs-app/.antisloprc.json .antisloprc.json
# or
cp examples/express-api/.antisloprc.json .antisloprc.json
# or
cp examples/monorepo/.antisloprc.json .antisloprc.json

# Add to package.json
{
  "scripts": {
    "lint:antislop": "claude-antislop check ./src"
  }
}

# Run
npm run lint:antislop
```

## 🏗️ Project Structure

```
claude-antislop/
├── cli/              # Command-line interface
├── mcp/              # MCP server implementation
├── vscode-extension/ # VS Code extension
├── rules/            # Detection rule definitions
├── templates/        # Config and report templates
├── tests/            # Test suite
├── docs/             # Documentation (30+ guides)
├── examples/         # Example projects (Next.js, Express, Monorepo)
└── scripts/          # Development scripts
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

### Quick Start

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/claude-antislop
cd claude-antislop

# Install dependencies
pnpm install

# Run in dev mode
pnpm dev

# Run tests
pnpm test
```

## 🔒 Security

This project includes built-in security auditing. See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) and [docs/SECURITY.md](docs/SECURITY.md) for details.

To report a security vulnerability, see our [Security Policy](docs/SECURITY.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built to combat the rising tide of AI-generated code slop. Inspired by real-world code review pain points and the need for automated quality gates in AI-assisted development.

## 🔗 Community

- **GitHub Issues:** [Report bugs or request features](https://github.com/mednabouli/claude-antislop/issues)
- **GitHub Discussions:** [Ask questions and share ideas](https://github.com/mednabouli/claude-antislop/discussions)
- **Twitter:** [@mednabouli](https://twitter.com/mednabouli) for updates
- **Discord:** [Join our community](https://discord.gg/your-invite-link) (coming soon)

---

**Maintained by** [@mednabouli](https://github.com/mednabouli) | [Report an Issue](https://github.com/mednabouli/claude-antislop/issues) | [Join Discussions](https://github.com/mednabouli/claude-antislop/discussions)
