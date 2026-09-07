# CLI Reference

## Commands

### install
```bash
claude-antislop install [options]
```
Options: --init-memory, --verbose

### status
```bash
claude-antislop status [options]
```
Options: --verbose

### scan
```bash
claude-antislop scan [options]
```
Options: --repo, --output, --verbose

### learn-from-git
```bash
claude-antislop learn-from-git [options]
```
Options: --repo, --recent, --verbose

### memory-search
```bash
claude-antislop memory-search [options]
```
Options: --query, --category, --limit, --fuzzy

### memory-write
```bash
claude-antislop memory-write [options]
```
Options: --category, --filename, --content, --append

### code-quality-check
```bash
claude-antislop code-quality-check [options]
```
Options: --code, --language, --checks

### mcp-server
```bash
claude-antislop mcp-server
```

### init-memory
```bash
claude-antislop init-memory [options]
```
Options: --force, --verbose

## Global Options
- -h, --help - Display help
- -V, --version - Display version

## Exit Codes
- 0 - Success
- 1 - Error

## Environment Variables
- HOME - Home directory (Unix)
- USERPROFILE - Home directory (Windows)
- NO_COLOR - Disable colored output

## Examples

### Quick Setup
```bash
npm install -g claude-antislop
claude-antislop init-memory
claude-antislop status
```

### Daily Workflow
```bash
claude-antislop status
claude-antislop memory-search --query "react patterns"
claude-antislop code-quality-check --code "const x = 1;"
claude-antislop learn-from-git --recent 7d
```

## See Also
- [Installation Guide](INSTALL.md)
- [Usage Guide](USAGE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
