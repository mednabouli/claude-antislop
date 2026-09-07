# Rule: no-var

**Category:** Style  
**Severity:** `error` (default)  
**Performance:** Low (AST-based)

## Description

Detects use of `var` declarations instead of modern `let` or `const`.

## Why It Matters

`var` is outdated and problematic:
- **Function scope:** `var` is function-scoped, not block-scoped
- **Hoisting:** `var` declarations are hoisted, causing confusion
- **No TDZ:** No temporal dead zone, allows use before declaration
- **Accidental globals:** Assigning to undeclared vars creates globals
- **Code quality:** Indicates outdated code or AI-generated slop

Modern JavaScript (ES2015+) provides `let` and `const` with better semantics.

## Examples

### ❌ Bad

```typescript
// Function scope (leaks outside blocks)
if (true) {
  var x = 5;
}
console.log(x); // 5 (leaked!)

// Hoisting confusion
console.log(y); // undefined (not error!)
var y = 10;

// Reassignment issues
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 5, 5, 5, 5, 5 (not 0-4!)

// Accidental global
function foo() {
  undeclared = 42; // Creates global variable!
}
```

### ✅ Good

```typescript
// Block scope
if (true) {
  let x = 5;
}
console.log(x); // ReferenceError: x is not defined

// No hoisting issues
console.log(z); // ReferenceError: z is not defined
let z = 10;

// Proper loop closure
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 0, 1, 2, 3, 4 (correct!)

// Explicit declarations
let count = 0;
const MAX = 100;
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-var": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-var": [
      "error",
      {
        "allowInForLoops": false,
        "allowInLegacyCode": false
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowInForLoops` | boolean | `false` | Allow `var` in for loop initializers (not recommended) |
| `allowInLegacyCode` | boolean | `false` | Allow `var` in files with `@legacy` JSDoc tag |

## When to Disable

### Legacy Code Migration

During TypeScript migration of old JavaScript code:

```json
{
  "overrides": [
    {
      "files": ["src/legacy/**/*"],
      "rules": {
        "no-var": "warn"
      }
    }
  ]
}
```

### Specific Patterns

Rare cases where `var` is intentional (e.g., IIFE patterns):

```typescript
// Intentional IIFE with var (rare in modern code)
var result = (function() {
  var private = 'secret';
  return { getValue: () => private };
})();
```

## Migration Guide

### Simple Replacement

```typescript
// Before
var count = 0;
var name = 'John';

// After
let count = 0; // If reassigned
const name = 'John'; // If never reassigned
```

### For Loops

```typescript
// Before
for (var i = 0; i < array.length; i++) {
  // ...
}

// After
for (let i = 0; i < array.length; i++) {
  // ...
}
```

### Function Scope to Block Scope

```typescript
// Before (function scope)
function process() {
  if (condition) {
    var temp = getValue();
  }
  console.log(temp); // Accessible here
}

// After (block scope)
function process() {
  if (condition) {
    let temp = getValue();
    console.log(temp); // Must be in same block
  }
}
```

## Related Rules

- [`prefer-const`](prefer-const.md) – Use const when possible
- [`no-unused-vars`](no-unused-vars.md) – Unused variables
- [`no-implicit-any`](no-implicit-any.md) – Implicit any types

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var) – var documentation
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) – let documentation
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) – const documentation
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/Scope%20%26%20Closures/ch5.md) – Hoisting and scope
