# Claude Anti-Slop Man Pages

## NAME

claude-antislop - Local-first code-quality memory and checks

## SYNOPSIS

```
c laude-antislop [options] [command]
```

## DESCRIPTION

Claude Anti-Slop is a local-first CLI tool that provides per-developer code quality checks without touching repository configuration. It uses a personal memory system to store coding standards, patterns, and templates.

## COMMANDS

### init-memory

Initialize memory directory.

```bash
c laude-antislop init-memory [options]
```

**Options:**
- `--force` - Overwrite existing memory

**Example:**
```bash
c laude-antislop init-memory
```

### status

Show plugin status.

```bash
c laude-antislop status [options]
```

**Options:**
- `--json` - Output as JSON
- `--locale <locale>` - Set locale (en, fr, es, de, zh, ja)
- `--quiet` - Suppress output

**Example:**
```bash
c laude-antislop status
c laude-antislop status --json
c laude-antislop status --locale fr
```

### scan

Scan repository for applied templates.

```bash
c laude-antislop scan [options]
```

**Options:**
- `--repo <path>` - Repository path (default: .)
- `--json` - Output as JSON
- `--verbose` - Verbose output

**Example:**
```bash
c laude-antislop scan --repo .
c laude-antislop scan --repo ./src --json
```

### memory-search

Search memory for content.

```bash
c laude-antislop memory-search [options]
```

**Options:**
- `--query <query>` - Search query (required)
- `--category <category>` - Category to search (standards, patterns, anti-patterns, examples, templates, all)
- `--json` - Output as JSON
- `--limit <number>` - Max results (default: 10)

**Example:**
```bash
c laude-antislop memory-search --query "react"
c laude-antislop memory-search --query "hook" --category standards --json
```

### memory-write

Write content to memory.

```bash
c laude-antislop memory-write [options]
```

**Options:**
- `--category <category>` - Category (standards, patterns, anti-patterns, examples, templates)
- `--filename <filename>` - Filename (required)
- `--content <content>` - Content (required)

**Example:**
```bash
c laude-antislop memory-write --category standards --filename my-standard.md --content "# My Standard"
```

### code-quality-check

Check code for quality issues.

```bash
c laude-antislop code-quality-check [options]
```

**Options:**
- `--code <code>` - Code to check (required)
- `--language <language>` - Language (javascript, typescript, python, etc.)
- `--json` - Output as JSON

**Example:**
```bash
c laude-antislop code-quality-check --code "const x = 1;" --language typescript
```

### templates

Manage templates.

```bash
c laude-antislop templates <command>
```

**Subcommands:**
- `list` - List available templates
- `install <stack>` - Install templates for stack
- `preview <path>` - Preview template
- `uninstall <stack>` - Uninstall templates

**Options:**
- `--json` - Output as JSON

**Example:**
```bash
c laude-antislop templates list
c laude-antislop templates install nextjs
c laude-antislop templates preview templates/nextjs/react-hooks.md
```

### watch

Watch directory for changes.

```bash
c laude-antislop watch [options]
```

**Options:**
- `--repo <path>` - Repository path (default: .)
- `--verbose` - Verbose output

**Example:**
```bash
c laude-antislop watch --repo ./src
```

### sync

Sync memory with cloud storage.

```bash
c laude-antislop sync <command>
```

**Subcommands:**
- `to-drive` - Sync to Google Drive
- `from-drive <path>` - Sync from Google Drive
- `list` - List sync backups
- `enable-auto` - Enable auto-sync
- `disable-auto` - Disable auto-sync
- `status` - Show sync status

**Options:**
- `--auto` - Auto mode
- `--force` - Force overwrite
- `--path <path>` - Backup path

**Example:**
```bash
c laude-antislop sync to-drive
c laude-antislop sync from-drive --path "~/Google Drive/Claude Anti-Slop/sync-latest.json"
c laude-antislop sync list
```

### completion

Generate shell completion scripts.

```bash
c laude-antislop completion <shell>
```

**Arguments:**
- `<shell>` - Shell type (bash, zsh, fish)

**Options:**
- `--install` - Install completion

**Example:**
```bash
c laude-antislop completion bash
c laude-antislop completion install zsh
```

## GLOBAL OPTIONS

### --version

Show version number.

```bash
c laude-antislop --version
```

### --help

Show help information.

```bash
c laude-antislop --help
c laude-antislop [command] --help
```

## ENVIRONMENT VARIABLES

### HOME

Home directory for memory storage (default: `~/.claude-antislop/memory`)

### GOOGLE_DRIVE

Custom Google Drive path (default: `~/Google Drive`)

## FILES

### ~/.claude-antislop/memory/

Memory directory containing:
- `standards/` - Coding standards
- `patterns/` - Code patterns
- `anti-patterns/` - Anti-patterns to avoid
- `examples/` - Good examples
- `templates/` - Project templates

### ~/.claude-antislop/config.json

Configuration file with:
- Locale settings
- Feature flags
- Sync settings

## EXAMPLES

### Basic Workflow

```bash
# Initialize
c laude-antislop init-memory

# Check status
c laude-antislop status

# Install templates
c laude-antislop templates install nextjs

# Search memory
c laude-antislop memory-search --query "react"

# Scan repository
c laude-antislop scan --repo .
```

### Advanced Workflow

```bash
# Write custom standard
c laude-antislop memory-write \
  --category standards \
  --filename my-standard.md \
  --content "# My Standard\n\nAlways use const"

# Check code quality
c laude-antislop code-quality-check \
  --code "const x = 1;" \
  --language typescript \
  --json

# Watch directory
c laude-antislop watch --repo ./src --verbose

# Sync to Drive
c laude-antislop sync to-drive
```

### CI/CD Integration

```bash
# In CI pipeline
c laude-antislop scan --repo . --json > scan.json

# Check results
jq '.success' scan.json
```

## EXIT CODES

- `0` - Success
- `1` - Error
- `2` - Invalid options

## SEE ALSO

- **Tutorial**: `man claude-antislop-tutorial`
- **Troubleshooting**: `man claude-antislop-troubleshooting`
- **Configuration**: `man claude-antislop-config`
- **Memory Sync**: `man claude-antislop-sync`

## BUGS

Report bugs at: https://github.com/mednabouli/claude-antislop/issues

## AUTHOR

mednabouli

## LICENSE

MIT
