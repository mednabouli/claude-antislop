# Contributing to Claude Anti-Slop

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

```bash
# Fork the repo
git clone https://github.com/YOUR_USERNAME/claude-antislop
cd claude-antislop

# Install dependencies
npm install

# Run the CLI
node cli/index.mjs --help

# Run tests (when available)
npm test
```

## 📁 Project Structure

```
claude-antislop/
├── cli/                    # Command-line interface
│   ├── index.mjs          # Main entry point
│   ├── lib/               # Core libraries
│   │   ├── ui.mjs         # UI helpers
│   │   ├── output.mjs     # Output formatting
│   │   ├── memory.mjs     # Memory management
│   │   ├── scan.mjs       # Repository scanning
│   │   ├── learn.mjs      # Git learning
│   │   ├── quality.mjs    # Quality checks
│   │   ├── install.mjs    # Installation
│   │   ├── status.mjs     # Status checking
│   │   ├── completion.mjs # Shell completions
│   │   ├── wizard.mjs     # Setup wizard
│   │   ├── i18n.mjs       # Internationalization
│   │   ├── watch.mjs      # Watch mode
│   │   ├── templates.mjs  # Templates CLI
│   │   └── sync.mjs       # Memory sync
│   └── completions/       # Shell completion scripts
├── templates/              # Pre-built templates
│   ├── nextjs/
│   ├── react/
│   └── nodejs/
├── vscode-extension/       # VS Code extension
├── docs/                   # Documentation
├── .github/workflows/      # CI/CD
├── package.json
└── README.md
```

## 🛠️ Development

### Running the CLI

```bash
# Show help
node cli/index.mjs --help

# Run a command
node cli/index.mjs status

# With JSON output
node cli/index.mjs status --json

# With locale
node cli/index.mjs status --locale fr
```

### Adding a New Command

1. Create a new file in `cli/lib/your-command.mjs`:

```javascript
import { ui } from './ui.mjs';
import { createSuccessResponse, createErrorResponse } from './output.mjs';

export async function yourCommand(options = {}) {
  const { json = false, quiet = false } = options;
  
  try {
    // Your logic here
    ui.success('Command completed');
    
    return createSuccessResponse('Command completed', { data: 'here' });
  } catch (error) {
    ui.error(error.message);
    return createErrorResponse(error.message);
  }
}
```

2. Add the command to `cli/index.mjs`:

```javascript
program
  .command('your-command')
  .description('Description of your command')
  .option('--json', 'JSON output')
  .option('--quiet, -q', 'Quiet mode')
  .option('--locale <lang>', 'Locale')
  .action(async (o) => {
    try {
      const { yourCommand } = await import('./lib/your-command.mjs');
      const result = await yourCommand(o);
      printOutput(result, o);
    } catch (e) {
      ui.error(e.message);
      process.exit(1);
    }
  });
```

3. Test it:

```bash
node cli/index.mjs your-command --help
node cli/index.mjs your-command --json
```

### Adding a Template

1. Create directory: `templates/your-stack/`
2. Add categories: `standards/`, `patterns/`, `anti-patterns/`
3. Add markdown files
4. Update `STACKS` in `cli/lib/templates.mjs`

Example:

```
templates/
└── your-stack/
    ├── standards/
    │   └── your-standard.md
    └── patterns/
        └── your-pattern.md
```

### Adding a Locale

1. Add translations to `cli/lib/i18n.mjs`:

```javascript
const translations = {
  en: { 'success.install': 'Installation complete', ... },
  fr: { 'success.install': 'Installation terminÃ©e', ... },
  de: { 'success.install': 'Installation abgeschlossen', ... },
  yourLang: { 'success.install': 'Your translation', ... }
};
```

2. Add to `SUPPORTED_LOCALES`:

```javascript
const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'de', 'zh', 'ja', 'yourLang'];
```

3. Test:

```bash
node cli/index.mjs status --locale yourLang
```

## 🧪 Testing

### Manual Testing

```bash
# Test all commands
node cli/index.mjs init-memory
node cli/index.mjs status
node cli/index.mjs scan --repo .
node cli/index.mjs memory-search --query "test"
node cli/index.mjs code-quality-check --code "const x = 1" --language typescript
node cli/index.mjs templates list
node cli/index.mjs completion bash
```

### Automated Testing (Future)

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testPathPattern=memory
```

## 📝 Code Style

- Use ES modules (`.mjs`)
- Use `const` and `let`, avoid `var`
- Use async/await for async operations
- Handle errors with try-catch
- Use template literals for strings
- Use arrow functions for callbacks
- Keep functions small and focused
- Add JSDoc comments for exported functions

Example:

```javascript
/**
 * Initialize memory directories
 * @param {Object} options - Options
 * @param {boolean} options.force - Overwrite existing
 * @param {boolean} options.verbose - Verbose output
 * @returns {Promise<Object>} Result object
 */
export async function initMemory(options = {}) {
  const { force = false, verbose = false } = options;
  // ...
}
```

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Try latest version
- Gather error messages and steps to reproduce

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Run `claude-antislop <command>`
2. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS, Linux]
- Node: [e.g. 20.10.0]
- Version: [e.g. 0.1.0]

**Additional context**
Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution**
What you want to happen.

**Describe alternatives**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
```

## 🔀 Pull Request Process

### Before Submitting

- [ ] Test your changes locally
- [ ] Update documentation if needed
- [ ] Add tests if applicable
- [ ] Run `npm install` to verify no breaking changes
- [ ] Check CI passes

### PR Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] Added tests
- [ ] CI passes

## Checklist

- [ ] Code follows project guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
```

## 📚 Documentation

### Writing Docs

- Use clear, concise language
- Include examples
- Add code snippets
- Use markdown formatting
- Keep docs up to date

### Documentation Structure

```
docs/
├── INSTALL.md           # Installation guide
├── USAGE.md             # Usage guide
├── CLI.md               # CLI reference
├── SHELL_COMPLETION.md  # Shell completion
├── WIZARD.md            # Wizard guide
├── JSON_OUTPUT.md       # JSON mode
├── LOCALIZATION.md      # Localization
├── MCP.md               # MCP server
├── VSCODE_EXTENSION.md  # VS Code extension
├── GITHUB_ACTION.md     # GitHub Action
├── WATCH_MODE.md        # Watch mode
├── SMART_TEMPLATES.md   # Templates
└── CONTRIBUTING.md      # This file
```

## 🎯 Areas Needing Help

### High Priority

- [ ] **Tests** - Add Jest/Vitest tests for all commands
- [ ] **TypeScript** - Migrate from `.mjs` to `.ts`
- [ ] **More templates** - Vue, Svelte, Python, Go, Rust
- [ ] **VS Code extension** - Complete and publish
- [ ] **Memory sync** - Implement Google Drive API

### Medium Priority

- [ ] **Documentation site** - VitePress or Docusaurus
- [ ] **More locales** - Italian, Portuguese, Korean, etc.
- [ ] **Performance** - Optimize large repo scanning
- [ ] **Watch mode** - Add auto-fix capability

### Nice to Have

- [ ] **Plugin system** - WASM plugins
- [ ] **Dashboard** - Web UI for memory
- [ ] **Team features** - Shared memory, sync
- [ ] **AI suggestions** - LLM-powered recommendations

## 💬 Community

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and ideas
- **Discord/Slack** - (Future) Real-time chat

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make Claude Anti-Slop better for everyone. Every PR, issue, and discussion helps!

---

**Ready to contribute?** Pick an issue, fork the repo, and start coding! 🚀
