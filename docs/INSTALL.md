# Installation Guide

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** 2.0.0 or higher

## Quick Install

```bash
git clone https://github.com/mednabouli/claude-antislop.git
cd claude-antislop
npm install
npm install -g .
claude-antislop --version
```

## Manual Installation

### Step 1: Clone
```bash
git clone https://github.com/mednabouli/claude-antislop.git
cd claude-antislop
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Initialize Memory (Optional)
```bash
claude-antislop init-memory
```

### Step 4: Verify Installation
```bash
claude-antislop status
```

## MCP Integration

Add to your MCP configuration:
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

## Troubleshooting

### Command Not Found
```bash
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Permission Errors
```bash
npm config set prefix ~/.npm-global
export PATH="$PATH:~/.npm-global/bin"
```

### Memory Directory Issues
```bash
claude-antislop init-memory --force
```

## Next Steps

- [Usage Guide](USAGE.md)
- [MCP Integration](MCP.md)
- [CLI Reference](CLI.md)
