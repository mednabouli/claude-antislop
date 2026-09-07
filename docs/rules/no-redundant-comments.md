# Rule: no-redundant-comments

**Category:** Slop  
**Severity:** `warn` (default)  
**Performance:** Low (AST + pattern analysis)

## Description

Detects comments that simply repeat what the code already says.

## Why It Matters

Redundant comments are problematic:
- **Noise:** Clutters code without adding value
- **Maintenance burden:** Must be updated when code changes
- **AI fingerprint:** Common in AI-generated code
- **Distraction:** Makes finding useful comments harder
- **Wasted space:** Increases file size unnecessarily

Comments should explain **why**, not **what**.

## Examples

### ❌ Bad

```typescript
// Get user by ID
function getUserById(id: string) {
  return users.find(u => u.id === id);
}

// Check if user is active
if (user.isActive) {
  // Process the order
  processOrder(order);
}

// Increment counter
counter++;

// Return true if valid
return isValid;

// Set loading to true
isLoading = true;

// Create new user
const user = new User();
```

### ✅ Good
```typescript
// Fetch from cache first, then DB if not found
function getUserById(id: string) {
  return cache.get(id) || db.users.find(u => u.id === id);
}

// Skip inactive users to avoid billing charges
if (user.isActive) {
  processOrder(order);
}

// Prevent race condition with atomic increment
counter++;

// Early return for performance optimization
return isValid;

// Trigger React re-render
isLoading = true;

// Use factory for proper initialization
const user = User.createAdmin();
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-redundant-comments": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-redundant-comments": [
      "warn",
      {
        "checkFunctionComments": true,
        "checkVariableComments": true,
        "checkBlockComments": true,
        "allowJSDoc": true,
        "minCodeLength": 10
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkFunctionComments` | boolean | `true` | Check comments above functions |
| `checkVariableComments` | boolean | `true` | Check comments above variables |
| `checkBlockComments` | boolean | `true` | Check inline block comments |
| `allowJSDoc` | boolean | `true` | Allow JSDoc-style documentation |
| `minCodeLength` | number | `10` | Minimum code length to check |

## Patterns Detected

### Function Comments

```typescript
// Calculate total
function calculateTotal() { /* ... */ }

// Get user
function getUser() { /* ... */ }
```

### Variable Comments

```typescript
// User name
const userName = 'John';

// Is loading flag
const isLoading = true;
```

### Inline Comments

```typescript
const total = price + tax; // Calculate total
user.isActive = true; // Set active to true
return result; // Return the result
```

## When to Disable

### JSDoc Documentation

Proper JSDoc is valuable:

```json
{
  "rules": {
    "no-redundant-comments": [
      "warn",
      {
        "allowJSDoc": true
      }
    ]
  }
}
```

```typescript
/**
 * Calculate order total with tax and discounts
 * @param items - Array of line items
 * @returns Total amount including tax
 * @throws Error if items is empty
 */
function calculateTotal(items: Item[]): number {
  // ... implementation
}
```

### Educational Code

Tutorials may use explanatory comments:

```json
{
  "overrides": [
    {
      "files": ["examples/**/*", "tutorials/**/*"],
      "rules": {
        "no-redundant-comments": "off"
      }
    }
  ]
}
```

## Comment Best Practices

### Good Comments Explain Why

```typescript
// Use debounce to prevent API spam
const search = debounce((query) => {
  fetchResults(query);
}, 300);

// Fallback to localStorage if IndexedDB unavailable
const storage = indexedDB || localStorage;
```

### Good Comments Document Intent

```typescript
// Temporary workaround for API bug #123
// TODO: Remove when API is fixed
const workaround = transformResponse(data);

// Performance optimization: cache expensive calculation
const cached = memoize(expensiveCalculation);
```

### Good Comments Warn About Issues

```typescript
// WARNING: This mutates the input array
function sortInPlace(arr: number[]) {
  arr.sort();
}

// FIXME: Race condition possible here
// See: https://github.com/org/repo/issues/456
async function fetchData() {
  // ...
}
```

## Related Rules

- [`no-boilerplate-intro`](no-boilerplate-intro.md) – Generic intros
- [`no-placeholder-comments`](no-placeholder-comments.md) – Placeholder comments
- [`no-todo-comments`](no-todo-comments.md) – TODO comments

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Clean Code: Comments](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29) – Comment best practices
- [JSDoc Documentation](https://jsdoc.app/) – JSDoc guide
- [Code Comments Best Practices](https://blog.codinghorror.com/code-should-be-commented/) – Coding Horror
