# Rule: no-unused-vars

**Category:** Quality  
**Severity:** `error` (default)  
**Performance:** Low (AST-based)

## Description

Detects declared variables, functions, or imports that are never used.

## Why It Matters

Unused code is technical debt:
- **Dead code:** Wastes memory and processing
- **Confusion:** Readers wonder why it exists
- **Maintenance:** Must be updated/migrated unnecessarily
- **Bundle size:** Increases download size
- **AI slop:** AI models often generate unused variables

Remove unused code or use it intentionally.

## Examples

### ❌ Bad

```typescript
// Unused variable
const unused = getValue();

// Unused function parameter
function process(data: Data, options: Options) {
  return data.value;
  // options is never used
}

// Unused import
import { formatDate } from './utils';
const result = processData(data);
// formatDate imported but never used

// Unused function
function unusedHelper() {
  return 'never called';
}

// Unused class
export class UnusedClass {
  // ...
}
```

### ✅ Good

```typescript
// Remove unused code
const value = getValue();

// Use all parameters
function process(data: Data, options: Options) {
  if (options.validate) {
    validate(data);
  }
  return data.value;
}

// Use imports
import { formatDate, processData } from './utils';
const formatted = formatDate(date);
const result = processData(data);

// Remove unused functions
// (delete unusedHelper)

// Use exported items
export class UsedClass {
  // ...
}
const instance = new UsedClass();
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-unused-vars": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "^_",
        "argsIgnorePattern": "^_",
        "ignoreRestSiblings": true,
        "reportUsedIgnorePattern": false,
        "allowInTests": false
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `varsIgnorePattern` | string | `"^_"` | Regex for variable names to ignore (e.g., `_unused`) |
| `argsIgnorePattern` | string | `"^_"` | Regex for parameter names to ignore |
| `ignoreRestSiblings` | boolean | `true` | Don't flag rest properties (`const { used, ...rest } = obj`) |
| `reportUsedIgnorePattern` | boolean | `false` | Report variables that match ignore pattern but ARE used |
| `allowInTests` | boolean | `false` | Allow unused vars in test files |

## Patterns Detected

### Variables

```typescript
// Unused
const x = 5;
let count = 0;
var old = value;

// Used
const value = getValue();
console.log(value);
```

### Function Parameters

```typescript
// Unused
function process(data: Data, unused: string) {
  return data.value;
}

// Used
function process(data: Data, formatter: Formatter) {
  return formatter.format(data.value);
}
```

### Imports

```typescript
// Unused imports
import { unused1, unused2 } from './utils';
import * as everything from './module';
import DefaultComponent from './component';

// Used imports
import { used1, used2 } from './utils';
const result = used1() + used2();
```

### Exports

```typescript
// Unused export
export const unused = 'never imported';

// Used export
export const config = { /* ... */ };
// (imported by another file)
```

## When to Disable

### Test Files

Tests may declare fixtures for future use:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-unused-vars": "warn"
      }
    }
  ]
}
```

### Intentionally Unused

Prefix with underscore to mark as intentionally unused:

```typescript
// Allowed with varsIgnorePattern: "^_"
const _unused = getValue();
function callback(_event: Event, data: Data) {
  // event intentionally unused
}
```

### TypeScript Declarations

Type-only imports may appear unused:

```typescript
// Used for types only
import { SomeType } from './types';
const value: SomeType = { /* ... */ };
```

## Related Rules

- [`no-undef`](no-undef.md) – Undefined variables
- [`no-redeclare`](no-redeclare.md) – Redeclared variables
- [`prefer-const`](prefer-const.md) – Use const

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [TypeScript: Unused Variables](https://www.typescriptlang.org/docs/handbook/variable-declarations.html) – Variable declarations
- [ESLint: no-unused-vars](https://eslint.org/docs/rules/no-unused-vars) – ESLint rule
