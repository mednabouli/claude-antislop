# Contributing to Claude AntiSlop

Thank you for your interest in contributing! This guide will help you set up your development environment and understand how to contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Adding New Rules](#adding-new-rules)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Community](#community)

## Getting Started

### Prerequisites

- **Node.js:** v20 or higher
- **Package Manager:** pnpm v8+ (recommended), npm, or yarn
- **Git:** For version control
- **Code Editor:** VS Code (recommended) or your preferred editor
- **Operating System:** macOS, Linux, or Windows (WSL2 recommended for Windows)

### First Time Setup

1. **Fork the repository**

   Click "Fork" on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-antislop.git
   cd claude-antislop
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/mednabouli/claude-antislop.git
   git fetch upstream
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

## Development Setup

### Install Dependencies

```bash
# Install all dependencies (including dev dependencies)
pnpm install

# Verify installation
pnpm list
```

### Build the Project

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter claude-antislop-cli
```

### Development Mode

```bash
# Watch mode for development
pnpm dev

# Run CLI in development
pnpm dev:cli check ./src
```

### Running the CLI

```bash
# Development mode (no build needed)
pnpm tsx cli/src/index.ts check ./src

# Or use the development script
pnpm dev:cli check ./src

# After building
pnpm build
node cli/dist/index.js check ./src
```

## Project Structure

```
claude-antislop/
├── cli/                      # Command-line interface
│   ├── src/
│   │   ├── index.ts          # CLI entry point
│   │   ├── commands/         # Command implementations
│   │   ├── formatters/       # Output formatters
│   │   └── utils/            # CLI utilities
│   ├── package.json
│   └── tsconfig.json
│
├── mcp/                      # MCP server
│   ├── src/
│   │   ├── index.ts          # Server entry
│   │   └── tools/            # MCP tools
│   ├── package.json
│   └── tsconfig.json
│
├── vscode-extension/         # VS Code extension
│   ├── src/
│   │   ├── extension.ts      # Extension entry
│   │   └── diagnostics.ts    # Diagnostic provider
│   ├── package.json
│   └── tsconfig.json
│
├── rules/                    # Detection rules
│   ├── src/
│   │   ├── index.ts          # Rule registry
│   │   ├── patterns/         # Pattern-based rules
│   │   ├── ast/              # AST-based rules
│   │   ├── security/         # Security rules
│   │   ├── quality/          # Quality rules
│   │   └── localization/     # Localization rules
│   ├── package.json
│   └── tsconfig.json
│
├── templates/                # Config templates
│   ├── schema.json           # JSON Schema for config
│   └── examples/             # Example configs
│
├── tests/                    # Test suite
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   ├── benchmarks/           # Performance tests
│   └── fixtures/             # Test fixtures
│
├── docs/                     # Documentation
│   ├── rules/                # Rule documentation
│   └── guides/               # User guides
│
├── examples/                 # Example projects
│   ├── strict/               # Strict config example
│   ├── relaxed/              # Relaxed config example
│   └── team/                 # Team config example
│
├── scripts/                  # Development scripts
│   ├── benchmark.js          # Performance benchmarks
│   └── generate-fixtures.js  # Test fixture generator
│
├── package.json              # Root package (workspace)
├── pnpm-workspace.yaml       # pnpm workspace config
├── tsconfig.json             # Root TypeScript config
└── .antisloprc.example       # Example config
```

## Making Changes

### 1. Create a Branch

```bash
# Ensure you're on main and up to date
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-123
```

### 2. Make Your Changes

- Follow existing code style
- Add tests for new functionality
- Update documentation
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test rules/no-placeholder-comments

# Run with coverage
pnpm test:coverage

# Run benchmarks
node scripts/benchmark.js
```

### 4. Lint and Format

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Adding New Rules

### Step 1: Create the Rule

Create a new file in `rules/src/patterns/` or `rules/src/ast/`:

```typescript
// rules/src/patterns/no-example-rule.ts
import { Rule, Diagnostic, File } from '../types';

export const noExampleRule: Rule = {
  id: 'no-example-rule',
  name: 'No Example Rule',
  description: 'Detects example patterns',
  severity: 'warn',
  category: 'slop',
  check: (file: File): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    
    // Your detection logic
    const pattern = /EXAMPLE_PATTERN/g;
    const lines = file.content.split('\n');
    
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        diagnostics.push({
          rule: 'no-example-rule',
          severity: 'warn',
          message: 'Example pattern detected',
          line: index + 1,
          column: line.search(pattern) + 1,
          snippet: line.trim(),
        });
      }
    });
    
    return diagnostics;
  },
};
```

### Step 2: Register the Rule

Add to `rules/src/index.ts`:

```typescript
import { noExampleRule } from './patterns/no-example-rule';

export const rules: Rule[] = [
  // ... existing rules
  noExampleRule,
];
```

### Step 3: Add Tests

Create `tests/rules/no-example-rule.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { noExampleRule } from '../../rules/src/patterns/no-example-rule';

describe('no-example-rule', () => {
  it('should detect example pattern', () => {
    const file = {
      path: 'test.ts',
      content: 'const x = EXAMPLE_PATTERN;',
    };
    
    const diagnostics = noExampleRule.check(file);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toBe('Example pattern detected');
  });
  
  it('should not flag valid code', () => {
    const file = {
      path: 'test.ts',
      content: 'const x = "valid code";',
    };
    
    const diagnostics = noExampleRule.check(file);
    expect(diagnostics).toHaveLength(0);
  });
});
```

### Step 4: Add Documentation

Create `docs/rules/no-example-rule.md`:

```markdown
# Rule: no-example-rule

**Category:** Slop  
**Severity:** `warn` (default)  
**Performance:** Low (pattern-based)

## Description

Detects example patterns in code.

## Why It Matters

Explain why this rule is important.

## Examples

### ❌ Bad

```typescript
const x = EXAMPLE_PATTERN;
```

### ✅ Good

```typescript
const x = VALID_CODE;
```

## Configuration

```json
{
  "rules": {
    "no-example-rule": "warn"
  }
}
```

## Related Rules

- [Related rule 1](related-rule-1.md)
- [Related rule 2](related-rule-2.md)

## See Also

- [Rules Index](../RULES.md)
```

### Step 5: Update Rules Index

Add to `docs/RULES.md` in the appropriate category table.

### Step 6: Run Tests

```bash
pnpm test no-example-rule
```

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run specific test
pnpm test no-placeholder-comments

# Run with watch mode
pnpm test:watch
```

### Integration Tests

```bash
# Run integration tests
pnpm test:integration

# Test CLI
pnpm test:cli
```

### Performance Tests

```bash
# Run benchmarks
node scripts/benchmark.js

# Generate fixtures
node scripts/generate-benchmarks.js
```

### Manual Testing

```bash
# Test on a real project
cd /path/to/test-project
node ../claude-antislop/cli/dist/index.js check ./src

# Test with watch mode
node ../claude-antislop/cli/dist/index.js watch ./src

# Test JSON output
node ../claude-antislop/cli/dist/index.js check ./src --output json
```

## Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples (bad vs good)
- Explain configuration options
- Link to related resources
- Keep examples realistic

### Documentation Structure

```
docs/
├── RULES.md                 # Master rules index
├── rules/                   # Individual rule docs
│   ├── no-placeholder-comments.md
│   └── ...
├── INSTALL.md               # Installation guide
├── USAGE.md                 # Usage guide
├── CLI.md                   # CLI reference
├── CONTRIBUTING.md          # This file
└── ...
```

### Building Documentation

```bash
# Check documentation links
pnpm docs:check

# Build documentation site (if applicable)
pnpm docs:build
```

## Submitting Changes

### 1. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add no-example-rule

- Implement pattern detection
- Add tests and documentation
- Update rules index"
```

**Commit message format:**

```
type: subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Refactoring
- `chore`: Maintenance

### 2. Push to Your Fork

```bash
git push origin your-branch-name
```

### 3. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template:
   - Clear title
   - Description of changes
   - Related issues
   - Testing done
4. Submit PR

### 4. Address Review Feedback

- Respond to comments promptly
- Make requested changes
- Push updates to same branch
- PR will auto-update

### 5. Merge

Once approved:
- Maintainer will merge
- Your branch can be deleted
- Changes appear in next release

## Code Style

### TypeScript

- Use strict mode
- Explicit types (no `any`)
- Prefer `const` over `let`
- Use template literals
- Async/await over promises

### Naming

- Variables: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_CASE`
- Files: `kebab-case.ts`

### Comments

- Explain **why**, not **what**
- Use JSDoc for public APIs
- Keep comments up to date
- Remove commented-out code

### Imports

```typescript
// 1. External packages
import express from 'express';

// 2. Internal modules
import { Rule } from '../types';

// 3. Relative imports
import { utils } from './utils';
```

## Debugging

### VS Code Setup

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CLI",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "node",
      "program": "${workspaceFolder}/cli/src/index.ts",
      "args": ["check", "./src"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "openOnSessionStart",
      "env": {
        "TS_NODE_FILES": "true"
      },
      "skipFiles": [
        "<node_internals>/**",
        "**/node_modules/**"
      ]
    }
  ]
}
```

### Logging

```typescript
// Debug mode
DEBUG=* pnpm dev:cli check ./src

# Or in code
console.debug('Debug info:', data);
```

## Common Issues

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### Test Failures

```bash
# Clear test cache
pnpm test:clean

# Run specific test
pnpm test --run path/to/test.ts
```

### Linting Errors

```bash
# Auto-fix
pnpm lint:fix

# Manual fix
pnpm lint
```

## Community

### Getting Help

- **GitHub Issues:** Bug reports and feature requests
- **GitHub Discussions:** Questions and ideas
- **Discord:** Real-time chat (link in README)
- **Twitter:** Updates and announcements

### Code of Conduct

We follow the [Contributor Covenant Code of Conduct](../CODE_OF_CONDUCT.md). Please read it before contributing.

### Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](../CONTRIBUTORS.md)
- Release notes
- Project README

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- Breaking changes → MAJOR
- New features → MINOR
- Bug fixes → PATCH

### Publishing

Maintainers handle releases:

```bash
# Bump version
pnpm version minor

# Publish to npm
pnpm publish

# Create GitHub release
# (done via GitHub UI)
```

## Questions?

- Check existing [issues](https://github.com/mednabouli/claude-antislop/issues)
- Start a [discussion](https://github.com/mednabouli/claude-antislop/discussions)
- Read [ARCHITECTURE.md](../ARCHITECTURE.md)
- Review [BENCHMARKS.md](../BENCHMARKS.md)

---

**Thank you for contributing!** 🙏

Your contributions make Claude AntiSlop better for everyone.
