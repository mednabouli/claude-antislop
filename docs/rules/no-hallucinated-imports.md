# Rule: no-hallucinated-imports

**Category:** Slop  
**Severity:** `error` (default)  
**Performance:** Medium (module resolution)

## Description

Detects imports from modules that don't exist or exports that aren't available—common in AI-generated code when the model invents APIs.

## Why It Matters

AI models frequently hallucinate:
- Non-existent packages: `import { foo } from 'nonexistent-package'`
- Wrong export names: `import { NonExistent } from 'real-package'`
- Typos in package names: `import x from 'lodahs'` (instead of `lodash`)
- Deprecated/removed APIs: `import { renderToString } from 'react-dom/server'` (moved in React 18)

These imports cause runtime errors and waste debugging time.

## Examples

### ❌ Bad

```typescript
// Non-existent package
import { helper } from 'utils-helper';

// Wrong export name
import { NonExistentFunction } from 'lodash';

// Typo in package name
import _ from 'lodahs';

// Deprecated API
import { renderToString } from 'react-dom/server';

// Invented method
import { formatDate } from 'date-fns'; // formatDate doesn't exist
```

### ✅ Good

```typescript
// Verify package exists
import { debounce } from 'lodash';

// Check export names in documentation
import { format } from 'date-fns';

// Use correct package name
import _ from 'lodash';

// Use current API (React 18+)
import { renderToPipeableStream } from 'react-dom/server';
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-hallucinated-imports": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-hallucinated-imports": [
      "error",
      {
        "allowMissing": false,
        "checkExports": true,
        "ignorePatterns": ["**/*.test.ts"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowMissing` | boolean | `false` | Allow imports even if module not found (not recommended) |
| `checkExports` | boolean | `true` | Verify exported names exist |
| `ignorePatterns` | string[] | `[]` | Files to skip (e.g., test files) |
| `aliasResolution` | boolean | `true` | Resolve TypeScript path aliases |

## How It Works

1. **Parse imports** – Extract all `import` and `require` statements
2. **Resolve modules** – Check if package exists in `node_modules`
3. **Verify exports** – Check if named exports exist (when possible)
4. **Check typos** – Fuzzy match against known packages

## Common Hallucinations

### Package Names

| Hallucinated | Real Package |
|--------------|--------------|
| `utils` | `lodash`, `ramda` |
| `helpers` | Custom module |
| `date-fns-utils` | `date-fns` |
| `react-utils` | Custom module |

### Export Names

| Hallucinated | Real Export |
|--------------|-------------|
| `formatDate` | `format` (date-fns) |
| `parseDate` | `parse` (date-fns) |
| `validateEmail` | Custom function |
| `deepClone` | `cloneDeep` (lodash) |

## When to Disable

- **Monorepo packages:** Local packages not yet published
- **Type stubs:** `.d.ts` files with ambient declarations
- **Dynamic imports:** Runtime-loaded modules

```json
{
  "overrides": [
    {
      "files": ["**/*.d.ts"],
      "rules": {
        "no-hallucinated-imports": "off"
      }
    }
  ]
}
```

## Related Rules

- [`no-copy-paste-artifacts`](no-copy-paste-artifacts.md) – Duplicate code
- [`require-type-annotations`](require-type-annotations.md) – Type safety
- [`no-any-type`](no-any-type.md) – Unsafe types

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Usage Guide](../USAGE.md) – Configuration guide
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html) – How imports work
