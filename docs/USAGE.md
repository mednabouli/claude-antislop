# Usage Guide

## Quick Start

```bash
npm install -g claude-antislop
npx claude-antislop --help
```

## CLI Commands

### Installation
```bash
claude-antislop install
claude-antislop install --init-memory
claude-antislop install --verbose
```

### Status Check
```bash
claude-antislop status
claude-antislop status --verbose
```

### Memory Operations
```bash
claude-antislop memory-search --query "TypeScript strict mode"
claude-antislop memory-search --query "patterns" --category patterns
claude-antislop memory-search --query "test" --limit 3

claude-antislop memory-write \
  --category standards \
  --filename my-standards.md \
  --content "# My Standards\n\n- Use TypeScript\n- Write tests"

claude-antislop memory-write \
  --category standards \
  --filename my-standards.md \
  --content "- Follow ESLint rules" \
  --append

claude-antislop init-memory
claude-antislop init-memory --force
```

### Code Quality
```bash
claude-antislop code-quality-check --code "const x = 1;" --language typescript
claude-antislop code-quality-check --code "const x = 1;" --checks lint,typecheck
```

### Repository Scanning
```bash
claude-antislop scan
claude-antislop scan --repo /path/to/repo
claude-antislop scan --verbose
```

### Git Learning
```bash
claude-antislop learn-from-git
claude-antislop learn-from-git --recent 90d
claude-antislop learn-from-git --repo /path/to/repo --recent 3m
```

### MCP Server
```bash
claude-antislop mcp-server
```

## MCP Integration

Add to MCP config:
```json
{
  "mcpServers": {
    "claude-antislop": {
      "command": "npx",
      "args": ["claude-antislop", "mcp-server"]
    }
  }
}
```

### Available Tools

1. **memory-search** - Search memory with fuzzy matching
2. **memory-write** - Write to memory with append/create modes
3. **code-quality-check** - Run ESLint, TypeScript, Prettier checks
4. **scan-repo** - Scan repository and generate templates
5. **learn-from-git** - Learn from git history

## Best Practices

### Memory Categories

- **standards**: Team coding standards
- **patterns**: Reusable solutions
- **anti-patterns**: Mistakes to avoid
- **insights**: Code review learnings
- **reviews**: Review notes

### Quality Checks

- Run before commits
- Use selective checks for speed
- Fix lint errors immediately
- Keep code formatted

## Examples

### Setup New Project
```bash
cd my-project
npm install -g claude-antislop
claude-antislop init-memory
claude-antislop scan
claude-antislop status
```

### Daily Workflow
```bash
claude-antislop status
claude-antislop code-quality-check --code "const x = 1;" --language typescript
claude-antislop memory-search --query "react patterns"
claude-antislop learn-from-git --recent 7d
```

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Next Steps

- [Installation Guide](INSTALL.md)
- [Contributing](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
