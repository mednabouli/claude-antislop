# Rule: no-fixme-comments

**Category:** Slop  
**Severity:** `warn` (default)  
**Performance:** Low (pattern-based)

## Description

Detects FIXME comments without proper context or resolution plan.

## Why It Matters

FIXME comments indicate:
- **Known bugs:** Issues acknowledged but not fixed
- **Technical debt:** Problems accumulating over time
- **AI generation:** Models add FIXME to acknowledge issues
- **Lost context:** No link to issue or discussion
- **Code smell:** Signals problematic code

Track issues properly instead of leaving FIXME comments.

## Examples

### ❌ Bad

```typescript
// FIXME: This is broken
function calculate() {
  return null;
}

// FIXME: Handle this edge case
if (condition) {
  // ...
}

// FIXME
// FIXME: Refactor this
// FIXME: Add error handling
```

### ✅ Good

```typescript
// FIXME: Race condition in concurrent requests (issue #123)
// See: https://github.com/org/repo/issues/123
async function calculate() {
  // ...
}

// FIXME: Handle null user - add validation layer
// Planned for v2.0 (Q3 2024)
if (condition) {
  // ...
}

// FIXME: Memory leak in production - urgent
// Workaround: Restart service every 24h
// Tracking: https://linear.app/company/issue/PROJ-456
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-fixme-comments": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-fixme-comments": [
      "warn",
      {
        "allowWithIssueReference": true,
        "allowWithDescription": true,
        "minDescriptionLength": 20,
        "patterns": ["FIXME", "BUG", "BROKEN"],
        "ignoreCase": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowWithIssueReference` | boolean | `false` | Allow FIXMEs with issue reference |
| `allowWithDescription` | boolean | `false` | Allow FIXMEs with detailed description |
| `minDescriptionLength` | number | `20` | Minimum description length to be allowed |
| `patterns` | string[] | `["FIXME", "BUG", "BROKEN"]` | Comment patterns to detect |
| `ignoreCase` | boolean | `true` | Case-insensitive matching |

## When to Disable

### Debug Mode

During active debugging:

```json
{
  "rules": {
    "no-fixme-comments": "off"
  }
}
```

### Test Files

Tests may have intentional FIXMEs:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-fixme-comments": "off"
      }
    }
  ]
}
```

## Related Rules

- [`no-todo-comments`](no-todo-comments.md) – TODO comments
- [`no-placeholder-comments`](no-placeholder-comments.md) – Placeholder comments
- [`no-boilerplate-intro`](no-boilerplate-intro.md) – Generic intros

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Managing Technical Debt](https://martinfowler.com/technicalDebt.html) – Martin Fowler
- [Issue Tracking Best Practices](https://www.atlassian.com/agile/project-management/issue-tracking) – Atlassian
