# MCP Integration Guide

## Overview

Claude Anti-Slop integrates with Claude Code via MCP, providing 5 tools for code quality and knowledge management.

## Installation

### Step 1: Install
```bash
npm install -g claude-antislop
```

### Step 2: Configure MCP

Add to `~/.claude/mcp.json`:
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

### Step 3: Restart Claude Code

## Available Tools

### 1. memory-search
Search memory with fuzzy matching.

Parameters:
- query (required)
- category (optional): all, standards, patterns, anti-patterns, insights, reviews
- limit (optional, default: 5)
- useFuzzy (optional, default: true)

### 2. memory-write
Write to memory with append/create modes.

Parameters:
- category (optional): standards, patterns, anti-patterns, insights, reviews
- filename (required)
- content (required)
- append (optional, default: false)

### 3. code-quality-check
Run ESLint, TypeScript, Prettier checks.

Parameters:
- code (required)
- language (optional): javascript, typescript
- checks (optional): [lint, typecheck, prettier]

### 4. scan-repo
Scan repository and generate templates.

Parameters:
- repo (optional)
- output (optional)
- verbose (optional)

### 5. learn-from-git
Learn from git history.

Parameters:
- repo (optional)
- recent (optional): 30d, 3m, 1y, 2w

## Troubleshooting

### MCP Server Not Starting
```bash
npx claude-antislop mcp-server
```

### Tools Not Available
1. Verify MCP config
2. Restart Claude Code
3. Check `claude-antislop status`

## Security
- All data stays local
- No external API calls
- No telemetry
- Per-developer isolation

## See Also
- [CLI Reference](CLI.md)
- [Usage Guide](USAGE.md)
