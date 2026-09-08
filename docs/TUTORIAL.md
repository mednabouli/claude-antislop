# Interactive Tutorial

Welcome to Claude Anti-Slop! This tutorial will guide you through the essential features.

## Prerequisites

- Node.js 18+ installed
- npm installed
- 10 minutes of time

## Step 1: Installation

```bash
# Install globally
npm install -g claude-antislop

# Verify installation
c laude-antislop --version

# Check help
c laude-antislop --help
```

**Expected output:**
```
claude-antislop/0.1.0

Usage: claude-antislop [options] [command]

Local-first code-quality memory and checks

Commands:
  init-memory           Initialize memory directory
  status                Show plugin status
  scan [options]        Scan repository
  memory-search         Search memory
  memory-write          Write to memory
  ... more commands
```

## Step 2: Initialize Memory

```bash
# Create memory directory
c laude-antislop init-memory

# Check what was created
ls -la ~/.claude-antislop/memory/
```

**Expected output:**
```
✓ Memory initialized at ~/.claude-antislop/memory
✓ Categories: standards, patterns, anti-patterns, examples, templates
```

## Step 3: Check Status

```bash
# Show status
c laude-antislop status

# Show status in JSON
c laude-antislop status --json
```

**Expected output:**
```
Plugin active: true
Memory initialized: true
Memory directory: ~/.claude-antislop/memory
Categories: 5
Total items: 0
```

## Step 4: Install Templates

```bash
# List available templates
c laude-antislop templates list

# Install Next.js templates
c laude-antislop templates install nextjs

# Verify installation
c laude-antislop memory-search --query "react" --json
```

**Expected output:**
```
Available Templates:
- nextjs
- react
- nodejs
- typescript

✓ Installed 15 templates for nextjs
```

## Step 5: Search Memory

```bash
# Search for React patterns
c laude-antislop memory-search --query "react" --category all

# Search with JSON output
c laude-antislop memory-search --query "react" --json

# Search in specific category
c laude-antislop memory-search --query "hook" --category standards
```

**Expected output:**
```
Found 5 results for "react":

[standards/react-hooks.md]
# React Hooks

Use functional components with hooks...

[patterns/custom-hooks.md]
# Custom Hooks

Extract reusable logic into custom hooks...

... more results
```

## Step 6: Write to Memory

```bash
# Write a new standard
c laude-antislop memory-write \
  --category standards \
  --filename my-standard.md \
  --content "# My Standard

This is my custom coding standard.

## Rules

1. Always use const
2. No console.log in production
3. Write tests"

# Verify it was written
c laude-antislop memory-search --query "my standard"
```

**Expected output:**
```
✓ Memory written to standards/my-standard.md

Found 1 results for "my standard":

[standards/my-standard.md]
# My Standard

This is my custom coding standard...
```

## Step 7: Scan Repository

```bash
# Scan current directory
c laude-antislop scan --repo .

# Scan with JSON output
c laude-antislop scan --repo . --json

# Scan specific directory
c laude-antislop scan --repo ./src
```

**Expected output:**
```
Scanning repository: /path/to/repo

Found 15 templates applied
Templates: 15
Anti-patterns: 0
Examples: 0

Scan complete!
```

## Step 8: Check Code Quality

```bash
# Check a code snippet
c laude-antislop code-quality-check \
  --code "const x = 1;" \
  --language typescript

# Check with issues
c laude-antislop code-quality-check \
  --code "var x = 1;" \
  --language javascript

# Check with JSON output
c laude-antislop code-quality-check \
  --code "var x = 1;" \
  --language javascript \
  --json
```

**Expected output:**
```
Code Quality Check

Issues found: 1

[warning] Prefer const over var
Line 1: var x = 1;
```

## Step 9: Use Watch Mode

```bash
# Watch a directory
c laude-antislop watch --repo ./src

# Watch with verbose output
c laude-antislop watch --repo ./src --verbose
```

**Expected output:**
```
Watching: ./src

[22:00:00] File changed: src/index.js
[22:00:00] Running checks...
[22:00:01] ✓ No issues found

Press Ctrl+C to stop
```

## Step 10: Localization

```bash
# Show status in French
c laude-antislop status --locale fr

# Show status in Spanish
c laude-antislop status --locale es

# Show status in Japanese
c laude-antislop status --locale ja
```

**Expected output:**
```
Plugin actif: true
Méµıoire initialisÚ©e: true
RÚ©pertoire mÚ©moire: ~/.claude-antislop/memory
CatÚ©gories: 5
Total Ú ©lÚ©ments: 15
```

## Step 11: Shell Completion

```bash
# Install Bash completion
c laude-antislop completion install bash

# Install Zsh completion
c laude-antislop completion install zsh

# Install Fish completion
c laude-antislop completion install fish

# Or source manually
eval "$(claude-antislop completion bash)"
```

**Expected output:**
```
✓ Completion installed for bash
✓ Added to ~/.bashrc

Restart your shell or run: source ~/.bashrc
```

## Step 12: Sync Memory (Optional)

```bash
# Enable auto-sync
c laude-antislop sync enable-auto

# Sync to Google Drive
c laude-antislop sync to-drive

# List backups
c laude-antislop sync list
```

**Expected output:**
```
✓ Auto-sync enabled
✓ Sync path: ~/Google Drive/Claude Anti-Slop

✓ Synced to Google Drive
Location: ~/Google Drive/Claude Anti-Slop/sync-2026-09-07T22-00-00-000Z.json
```

## Next Steps

### Daily Workflow

```bash
# Morning: Check status
c laude-antislop status

# During coding: Check snippets
c laude-antislop code-quality-check --code "..." --language typescript

# Before commit: Scan repo
c laude-antislop scan --repo .

# End of day: Sync memory
c laude-antislop sync to-drive
```

### Advanced Usage

- **Custom templates**: Write your own templates in `~/.claude-antislop/memory/templates/`
- **Team standards**: Share memory directory via Git or cloud sync
- **CI integration**: Use `claude-antislop scan --json` in CI pipelines
- **VS Code extension**: Install for in-editor checks

## Troubleshooting

### Command not found
```bash
npm install -g claude-antislop
which claude-antislop
```

### Memory not initialized
```bash
c laude-antislop init-memory
```

### No results from search
```bash
# Install templates
c laude-antislop templates install nextjs

# Or write your own
c laude-antislop memory-write --category standards --filename test.md --content "# Test"
```

## Resources

- **Full Documentation**: https://github.com/mednabouli/claude-antislop/tree/main/docs
- **GitHub Issues**: https://github.com/mednabouli/claude-antislop/issues
- **Discussions**: https://github.com/mednabouli/claude-antislop/discussions

---

**Congratulations! You've completed the tutorial!** 🎉

You're now ready to use Claude Anti-Slop effectively!
