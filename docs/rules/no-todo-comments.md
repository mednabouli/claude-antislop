# Rule: no-todo-comments

**Category:** Slop  
**Severity:** `warn` (default)  
**Performance:** Low (pattern-based)

## Description

Detects TODO comments without proper context or issue references.

## Why It Matters

TODO comments often indicate:
- **Incomplete work:** Features left unfinished
- **Technical debt:** Known issues not tracked
- **AI generation:** Models add TODOs to avoid complex implementation
- **Lost context:** No link to issue or discussion
- **Code clutter:** Accumulate over time

Use issue trackers instead of TODO comments.

## Examples

### ❌ Bad

```typescript
// TODO: Implement this
function processOrder() {
  // ...
}

// TODO: Fix later
const result = calculate();

// TODO
// TODO: Add validation
// TODO: Handle errors
// TODO: Optimize this
```

### ✅ Good

```typescript
// TODO: Implement caching (issue #123)
function processOrder() {
  // ...
}

// TODO: Fix race condition (GH-456)
// See: https://github.com/org/repo/issues/456
const result = calculate();

// FIXME: Memory leak in production (urgent)
// Tracked in: https://linear.app/company/issue/PROJ-789

// HACK: Temporary workaround for API bug
// Remove after API v2 migration (planned Q3)
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-todo-comments": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-todo-comments": [
      "warn",
      {
        "allowWithIssueReference": true,
        "allowWithDescription": true,
        "minDescriptionLength": 20,
        "patterns": ["TODO", "FIXME", "XXX", "HACK"],
        "ignoreCase": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowWithIssueReference` | boolean | `false` | Allow TODOs with issue reference (#123, GH-456) |
| `allowWithDescription` | boolean | `false` | Allow TODOs with detailed description |
| `minDescriptionLength` | number | `20` | Minimum description length to be allowed |
| `patterns` | string[] | `["TODO", "FIXME", "XXX", "HACK"]` | Comment patterns to detect |
| `ignoreCase` | boolean | `true` | Case-insensitive matching |

## When to Disable

### Active Development

During active feature development:

```json
{
  "rules": {
    "no-todo-comments": "off"
  }
}
```

### Test Files

Tests may have intentional TODOs:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-todo-comments": "off"
      }
    }
  ]
}
```

## Related Rules

- [`no-placeholder-comments`](no-placeholder-comments.md) – Placeholder comments
- [`no-fixme-comments`](no-fixme-comments.md) – FIXME comments
- [`no-redundant-comments`](no-redundant-comments.md) – Obvious comments

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Managing Technical Debt](https://martinfowler.com/technicalDebt.html) – Martin Fowler
- [GitHub Issues](https://docs.github.com/en/issues) – Issue tracking
- [Linear](https://linear.app/) – Issue tracking for teams
