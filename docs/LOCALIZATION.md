# Localized CLI Messages

Claude Anti-Slop supports localized CLI messages in six languages.

## Supported Locales

| Code | Language |
|---|---|
| `en` | English |
| `fr` | French |
| `es` | Spanish |
| `de` | German |
| `zh` | Chinese (Simplified) |
| `ja` | Japanese |

## Select a Locale

Use `--locale` with any command:

```bash
claude-antislop status --locale fr
claude-antislop scan --repo . --locale es
claude-antislop wizard --locale ja
```

The selected locale affects human-readable messages only. JSON field names remain stable for automation.

## Locale Resolution

The CLI resolves its language in this order:

1. The command-line `--locale` value
2. The locale saved in `~/.claude-antislop/config.json`
3. `LC_ALL`, `LC_MESSAGES`, or `LANG`
4. English (`en`)

## Automation

Use `--json` with a locale if you need translated message text while preserving stable JSON keys:

```bash
claude-antislop status --locale fr --json
```
