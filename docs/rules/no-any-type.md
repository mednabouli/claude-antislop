# Rule: no-any-type

**Category:** Quality  
**Severity:** `error` (default)  
**Performance:** Low (AST-based)

## Description

Detects use of the `any` type, which disables type checking and defeats TypeScript's purpose.

## Why It Matters

The `any` type is dangerous because:
- **No type safety:** All operations are allowed, errors become runtime bugs
- **Poor documentation:** Doesn't communicate intent or constraints
- **Bad IDE support:** No autocomplete or type hints
- **Code smell:** Often indicates lazy typing or lack of understanding
- **AI-generated slop:** AI models frequently use `any` to avoid type errors

Use `unknown`, specific types, or proper type definitions instead.

## Examples

### ❌ Bad

```typescript
// Function parameters
function process(data: any) {
  return data.value;
}

// Variables
let value: any = getValue();
const result: any = await fetch();

// Return types
function getData(): any {
  return response.data;
}

// Arrays
const items: any[] = [];
items.push('string');
items.push(123);
items.push({ foo: 'bar' });

// Type assertions
const el = document.getElementById('app') as any;
const data = response as any;
```

### ✅ Good

```typescript
// Specific types
function process(data: UserData) {
  return data.value;
}

// Type inference
let value = getValue(); // Type inferred

// Proper return type
function getData(): Promise<ApiResponse> {
  return response.data;
}

// Typed arrays
const items: string[] = [];
const users: User[] = [];

// Type unions
function process(data: string | number | User) {
  // Handle each type
}

// Unknown (safer than any)
function process(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // Type guard before accessing properties
  }
}

// Generics
function identity<T>(arg: T): T {
  return arg;
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-any-type": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-any-type": [
      "error",
      {
        "allowInTests": false,
        "allowExternalModules": true,
        "allowTypeAssertions": false
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowInTests` | boolean | `false` | Allow `any` in test files |
| `allowExternalModules` | boolean | `true` | Allow `any` in type definitions for external modules |
| `allowTypeAssertions` | boolean | `false` | Allow `as any` assertions (not recommended) |

## Common Anti-Patterns

### The "I Don't Know" Type

```typescript
// ❌ Bad
function handleResponse(response: any) {
  return response.data;
}

// ✅ Good
interface ApiResponse {
  data: unknown;
  status: number;
}

function handleResponse(response: ApiResponse) {
  return response.data;
}
```

### The Lazy Array

```typescript
// ❌ Bad
const results: any[] = [];

// ✅ Good
interface Result {
  id: number;
  value: string;
}

const results: Result[] = [];
```

### The Escape Hatch

```typescript
// ❌ Bad
const data = json as any;

// ✅ Good
interface Data {
  foo: string;
  bar: number;
}

const data = json as Data;
```

## Better Alternatives

### Use `unknown`

```typescript
// Safer than any
function process(data: unknown) {
  // Must narrow type before use
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  if (isObject(data)) {
    return data.value;
  }
}
```

### Use Type Guards

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    typeof obj.name === 'string'
  );
}

function process(data: unknown) {
  if (isUser(data)) {
    return data.name; // Type is User here
  }
}
```

### Use Generics

```typescript
// Flexible but type-safe
function wrap<T>(value: T): { value: T } {
  return { value };
}

const wrapped = wrap('hello'); // { value: string }
```

### Use Utility Types

```typescript
// Partial, Pick, Omit, etc.
function update(id: number, changes: Partial<User>) {
  // Only User properties allowed
}

function getFields(user: User): Pick<User, 'id' | 'name'> {
  return { id: user.id, name: user.name };
}
```

## When to Disable

- **Test files:** Mock data and fixtures
- **Type definitions:** `.d.ts` files for external libraries
- **Migration:** Temporarily during TypeScript migration

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-any-type": "warn"
      }
    },
    {
      "files": ["**/*.d.ts"],
      "rules": {
        "no-any-type": "off"
      }
    }
  ]
}
```

## Related Rules

- [`require-type-annotations`](require-type-annotations.md) – Type safety
- [`no-unused-vars`](no-unused-vars.md) – Unused variables
- [`no-lazy-naming`](no-lazy-naming.md) – Generic naming

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [TypeScript: any vs unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#any) – Type safety guide
- [Avoiding The Any Type](https://basarat.gitbook.io/typescript/type-system/no-any) – Best practices
