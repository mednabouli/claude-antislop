# Watch Mode

Claude Anti-Slop includes a **watch mode** for real-time code quality feedback as you work.

## Start Watch Mode

```bash
claude-antislop watch
claude-antislop watch --repo ./my-project
claude-antislop watch --verbose
```

## Features

- **Real-time monitoring** - Watches for file changes
- **Instant feedback** - Runs quality checks on change
- **Debounced execution** - Waits 500ms after last change
- **Smart filtering** - Ignores node_modules, dist, tests, etc.
- **Multi-language** - Supports TypeScript, JavaScript, Vue, Svelte, Python, Go, Rust

## Usage

### Basic Watch

```bash
# Watch current directory
claude-antislop watch

# Watch specific repo
claude-antislop watch --repo ./my-project
```

### Verbose Output

```bash
claude-antislop watch --verbose
```

### JSON Output

```bash
claude-antislop watch --json
```

## Ignored Patterns

Watch mode automatically ignores:

- `node_modules/`
- `.git/`
- `dist/`
- `build/`
- `*.test.*`
- `*.spec.*`
- `coverage/`
- `.cache/`
- `*.log`

## Watched Extensions

- `.ts`, `.tsx` (TypeScript)
- `.js`, `.jsx` (JavaScript)
- `.vue` (Vue)
- `.svelte` (Svelte)
- `.py` (Python)
- `.go` (Go)
- `.rs` (Rust)

## Example Output

```
────────────────────────────────────────────────────────────
👀 Watch Mode
────────────────────────────────────────────────────────────

ℹ Watching: /Users/med/projects/my-project
ℹ Extensions: .ts, .tsx, .js, .jsx, .vue, .svelte, .py, .go, .rs

✓ Watcher ready

ℹ Press Ctrl+C to stop

Changed: src/components/Button.tsx
✓ src/components/Button.tsx - No issues

Changed: src/utils/format.ts
✗ src/utils/format.ts - Type error
  Hint: Argument of type 'string' is not assignable to parameter of type 'number'
```

## Integration

### VS Code Task

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Watch Quality",
      "type": "shell",
      "command": "claude-antislop watch",
      "problemMatcher": {
        "owner": "typescript",
        "fileLocation": ["relative", "${workspaceRoot}"],
        "pattern": {
          "regexp": "^(✗)\\s(.+)\\s-\\s(.+)$",
          "file": 2,
          "message": 3
        }
      },
      "isBackground": true,
      "presentation": { "reveal": "never" }
    }
  ]
}
```

### npm Script

Add to `package.json`:

```json
{
  "scripts": {
    "watch:quality": "claude-antislop watch"
  }
}
```

### Pre-commit Hook

Use with Husky:

```bash
# .husky/pre-commit
npx claude-antislop scan --repo . --output /tmp/templates
```

## Configuration

Watch mode uses sensible defaults. To customize:

- **Debounce**: Modify `DEBOUNCE_MS` in source (default: 500ms)
- **Patterns**: Add to `IGNORE_PATTERNS` array
- **Extensions**: Add to `WATCH_EXTENSIONS` array

## Performance

Watch mode is optimized for performance:

- **Debouncing** - Prevents rapid re-checks
- **File filtering** - Only watches relevant extensions
- **Directory ignoring** - Skips large directories
- **Efficient checks** - Reuses CLI infrastructure

## Tips

- Run in a separate terminal alongside your editor
- Use `--verbose` to see all file changes
- Combine with auto-save in your editor
- Use with VS Code Problems panel integration

## See Also

- [CLI Reference](CLI.md)
- [Code Quality Checks](QUALITY.md)
- [VS Code Extension](VSCODE_EXTENSION.md)
