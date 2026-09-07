# Rule: require-type-annotations

**Category:** Quality  
**Severity:** `error` (default)  
**Performance:** Medium (AST-based)

## Description

Requires explicit type annotations on function parameters, return types, and variable declarations to ensure type safety and code clarity.

## Why It Matters

Type annotations provide:
- **Type safety:** Catch errors at compile time, not runtime
- **Documentation:** Clear contract for function inputs/outputs
- **IDE support:** Better autocomplete and refactoring
- **Maintainability:** Easier to understand and modify code
- **AI code quality:** Prevents AI from generating ambiguous types

TypeScript's type inference is powerful, but explicit annotations improve code quality.

## Examples

### ❌ Bad

```typescript
// Missing parameter types
function add(a, b) {
  return a + b;
}

// Missing return type
function getUser(id: number) {
  return fetchUser(id);
}

// Missing variable type
const data = await fetchData();
let count = 0;

// Implicit any
const users = [];
users.push({ name: 'John' });

// Arrow functions without types
const multiply = (a, b) => a * b;
```

### ✅ Good

```typescript
// Explicit parameter types
function add(a: number, b: number): number {
  return a + b;
}

// Explicit return type
function getUser(id: number): Promise<User> {
  return fetchUser(id);
}

// Explicit variable type
const data: ApiResponse = await fetchData();
let count: number = 0;

// Typed arrays
const users: User[] = [];
users.push({ name: 'John', age: 30 });

// Typed arrow functions
const multiply = (a: number, b: number): number => a * b;
```

## Configuration

### Basic

```json
{
  "rules": {
    "require-type-annotations": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "require-type-annotations": [
      "error",
      {
        "requireParameterTypes": true,
        "requireReturnType": true,
        "requireVariableType": true,
        "allowInferredTypes": false,
        "allowContextualTypes": true,
        "ignoreFiles": ["**/*.test.ts"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `requireParameterTypes` | boolean | `true` | Require types on function parameters |
| `requireReturnType` | boolean | `true` | Require return type annotations |
| `requireVariableType` | boolean | `false` | Require explicit variable types |
| `allowInferredTypes` | boolean | `true` | Allow TypeScript to infer types from initializers |
| `allowContextualTypes` | boolean | `true` | Allow contextual typing (e.g., in generics) |
| `ignoreFiles` | string[] | `[]` | Files to skip (e.g., test files) |

## When to Disable

### Test Files

Test files often use mocks and fixtures where types are obvious:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "rules": {
        "require-type-annotations": "off"
      }
    }
  ]
}
```

### Simple Literals

For simple literals, inference is safe:

```typescript
// These are fine with allowInferredTypes: true
const name = 'John'; // string
const age = 30; // number
const active = true; // boolean
```

### Generic Context

TypeScript can infer generic types contextually:

```typescript
// Type is inferred from array elements
const users: User[] = [
  { name: 'John' },
  { name: 'Jane' },
];

// Type is inferred from Promise
const data = await fetch<User>('/api/user');
```

## Related Rules

- [`no-any-type`](no-any-type.md) – Unsafe any usage
- [`no-lazy-naming`](no-lazy-naming.md) – Generic naming
- [`no-unused-vars`](no-unused-vars.md) – Unused variables

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [TypeScript Handbook: Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) – Type system guide
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript) – Comprehensive guide
