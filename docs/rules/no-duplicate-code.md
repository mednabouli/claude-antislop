# Rule: no-duplicate-code

**Category:** Quality  
**Severity:** `error` (default)  
**Performance:** Medium (AST comparison)

## Description

Detects duplicated code blocks across files or within the same file.

## Why It Matters

Code duplication is a major maintainability issue:
- **Bug multiplication:** Fix bug in one place, forget others
- **Inconsistency:** Copies drift apart over time
- **Increased size:** More code to test and maintain
- **Refactoring difficulty:** Changes require updates in multiple places
- **AI slop:** AI models often repeat similar code patterns

"Don't Repeat Yourself" (DRY) is a core software engineering principle.

## Examples

### ❌ Bad

```typescript
// Duplicate in same file
function calculateUserTotal(user: User): number {
  let total = 0;
  for (const item of user.items) {
    total += item.price * item.quantity;
  }
  const tax = total * 0.13;
  return total + tax;
}

function calculateOrderTotal(order: Order): number {
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  const tax = total * 0.13;
  return total + tax;
}

// Duplicate across files
// file1.ts
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// file2.ts
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

### ✅ Good

```typescript
// Extracted to shared function
function calculateTotal(items: Array<{price: number; quantity: number}>): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  const tax = total * 0.13;
  return total + tax;
}

function calculateUserTotal(user: User): number {
  return calculateTotal(user.items);
}

function calculateOrderTotal(order: Order): number {
  return calculateTotal(order.items);
}

// Shared utility
// utils/formatDate.ts
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Usage in both files
import { formatDate } from '../utils/formatDate';
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-duplicate-code": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-duplicate-code": [
      "error",
      {
        "minLines": 5,
        "minTokens": 30,
        "allowSimilar": false,
        "ignoreComments": true,
        "ignoreStrings": false,
        "excludePatterns": ["**/*.test.ts", "**/generated/**"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLines` | number | `5` | Minimum lines to consider as duplicate |
| `minTokens` | number | `30` | Minimum tokens to consider as duplicate |
| `allowSimilar` | boolean | `false` | Allow similar (not exact) code |
| `ignoreComments` | boolean | `true` | Ignore comments when comparing |
| `ignoreStrings` | boolean | `false` | Ignore string literals when comparing |
| `excludePatterns` | string[] | `[]` | Files to exclude (tests, generated code) |

## Patterns Detected

### Exact Duplicates

```typescript
// Same code in two functions
function processUser(user: User) {
  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
  return JSON.stringify(data);
}

function processAdmin(admin: Admin) {
  const data = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    createdAt: admin.createdAt.toISOString(),
  };
  return JSON.stringify(data);
}
```

### Near Duplicates

```typescript
// Only variable names differ
const userTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const orderTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

### Across Files

```typescript
// src/utils/helpers.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// src/lib/formatting.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

## When to Disable

### Test Files

Tests often have repetitive fixtures:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-duplicate-code": "off"
      }
    }
  ]
}
```

### Generated Code

Code generators produce duplicates intentionally:

```json
{
  "overrides": [
    {
      "files": ["src/generated/**/*"],
      "rules": {
        "no-duplicate-code": "off"
      }
    }
  ]
}
```

### Intentional Repetition

Sometimes duplication is better than wrong abstraction:

```typescript
// Different contexts, similar code is OK
function handleUserClick() { /* ... */ }
function handleButtonClick() { /* ... */ }
```

## Related Rules

- [`max-function-length`](max-function-length.md) – Long functions
- [`complexity`](complexity.md) – Cyclomatic complexity
- [`no-copy-paste-artifacts`](no-copy-paste-artifacts.md) – Copy-paste detection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) – Software engineering principle
- [Refactoring: Extract Function](https://refactoring.com/catalog/extractFunction.html) – Refactoring technique
- [eslint-plugin-duplicate-code](https://www.npmjs.com/package/eslint-plugin-duplicate-code) – ESLint plugin
