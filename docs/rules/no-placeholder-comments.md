# Rule: no-placeholder-comments

**Category:** Slop  
**Severity:** `error` (default)  
**Performance:** Low (pattern-based)

## Description

Detects placeholder comments that indicate incomplete or AI-generated code without proper context.

## Why It Matters

Placeholder comments like `// TODO: implement this` are common in AI-generated code when the model:
- Doesn't know how to complete a task
- Is avoiding complex implementation
- Was given vague instructions
- Ran out of token budget

These comments create technical debt and reduce code quality.

## Examples

### ❌ Bad

```typescript
// TODO: implement this
function calculateTotal(items: any[]) {
  // FIXME: this is broken
  return 0;
}

// TODO
// TODO: fix later
// TODO: add validation
```

### ✅ Good

```typescript
/**
 * Calculates total price including tax and discounts.
 * @see https://github.com/myorg/myapp/issues/123
 */
function calculateTotal(items: CartItem[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const discount = applyDiscount(subtotal);
  
  return subtotal + tax - discount;
}

// TODO: Optimize for large datasets (perf issue #456)
// FIXME: Handle edge case when items is empty (bug #789)
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-placeholder-comments": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-placeholder-comments": [
      "error",
      {
        "allowWithIssueReference": true,
        "allowWithDescription": true,
        "minLength": 20
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowWithIssueReference` | boolean | `false` | Allow TODOs with GitHub issue reference (`#123` or URL) |
| `allowWithDescription` | boolean | `false` | Allow TODOs with detailed description (>20 chars) |
| `minLength` | number | `0` | Minimum comment length to be allowed |
| `patterns` | string[] | `[]` | Custom regex patterns to detect |

## When to Disable

- **Prototyping:** During rapid iteration
- **Test files:** `**/*.test.ts` often have placeholder tests
- **Scaffolding:** When generating boilerplate code

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-placeholder-comments": "off"
      }
    }
  ]
}
```

## Related Rules

- [`no-todo-comments`](no-todo-comments.md) – Stricter TODO detection
- [`no-fixme-comments`](no-fixme-comments.md) – FIXME comment detection
- [`no-redundant-comments`](no-redundant-comments.md) – Comments that repeat code

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Usage Guide](../USAGE.md) – Configuration guide
- [RECIPES.md](../../RECIPES.md) – Common workflows
