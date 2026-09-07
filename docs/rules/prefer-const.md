# Rule: prefer-const

**Category:** Style  
**Severity:** `warn` (default)  
**Performance:** Low (AST-based)

## Description

Enforces using `const` for variables that are never reassigned.

## Why It Matters

Using `const` by default provides:
- **Immutability guarantees:** Readers know value won't change
- **Intent clarity:** Signals the variable is constant
- **Compiler optimizations:** Enables better optimization
- **Accidental mutation prevention:** Compile error if reassigned
- **Code quality:** Modern JavaScript best practice

Use `let` only when reassignment is necessary. Never use `var`.

## Examples

### ❌ Bad

```typescript
// Never reassigned
let count = 0;
console.log(count);

// Function parameter (never modified)
function process(data: Data) {
  let result = transform(data);
  return result;
}

// Loop variable (not reassigned)
for (let item of items) {
  console.log(item);
}

// Destructuring (never modified)
let { name, age } = user;
console.log(name, age);
```

### ✅ Good

```typescript
// Using const for non-reassigned
const count = 0;
console.log(count);

// Still using let for reassigned
let count = 0;
count++; // Reassigned

// Function parameter
function process(data: Data) {
  const result = transform(data);
  return result;
}

// Loop variable
for (const item of items) {
  console.log(item);
}

// Destructuring
const { name, age } = user;
console.log(name, age);

// Array methods instead of loops
const results = items.map(item => transform(item));
```

## Configuration

### Basic

```json
{
  "rules": {
    "prefer-const": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "prefer-const": [
      "warn",
      {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false,
        "allowConstInForOf": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `destructuring` | string | `"any"` | When to check destructuring: `"any"`, `"all"`, `"never"` |
| `ignoreReadBeforeAssign` | boolean | `false` | Ignore if variable is read before assigned |
| `allowConstInForOf` | boolean | `true` | Allow `const` in for-of loops (usually preferred) |

## Destructuring Behavior

### `"any"` (default)

If any variable in destructuring should be const, all must be const:

```typescript
// ❌ Bad - mixed const/let
const { a } = obj;
let { b } = obj;

// ✅ Good - all const
const { a } = obj;
const { b } = obj;
```

### `"all"`

Only warn if ALL variables can be const:

```typescript
// ✅ Allowed - some reassigned
const { a } = obj;
let { b } = obj;
b = newValue; // Reassigned
```

### `"never"`

Don't check destructuring:

```typescript
// ✅ Always allowed
let { a, b } = obj;
```

## When to Disable

### Intentional let for Future Proofing

When you expect to add reassignment later:

```typescript
// Intentional let for planned feature
let featureEnabled = false;
// TODO: Will be toggled in next PR
```

### Test Files

Tests may use `let` for fixtures:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "prefer-const": "off"
      }
    }
  ]
}
```

## Related Rules

- [`no-var`](no-var.md) – Avoid var
- [`no-unused-vars`](no-unused-vars.md) – Unused variables
- [`no-reassign`](no-reassign.md) – Prevent reassignment

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) – const documentation
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) – let documentation
- [ESLint: prefer-const](https://eslint.org/docs/rules/prefer-const) – ESLint rule
