# Rule: no-debugger

**Category:** Style  
**Severity:** `error` (default)  
**Performance:** Low (AST-based)

## Description

Detects `debugger` statements left in source code.

## Why It Matters

`debugger` statements are development artifacts that should never reach production:
- **Execution halt:** Stops code execution in production
- **Poor UX:** Users see frozen UI or hanging requests
- **Security risk:** Exposes internal state to browser DevTools
- **Code quality:** Indicates incomplete cleanup before commit
- **AI slop:** AI models sometimes add debugger for "inspection"

Use proper debugging tools and logging instead.

## Examples

### ❌ Bad

```typescript
// Leftover debugger
function process(data) {
  debugger; // Forgot to remove!
  return transform(data);
}

// Conditional debugger
if (someCondition) {
  debugger;
}

// In catch blocks
try {
  riskyOperation();
} catch (error) {
  debugger;
  throw error;
}

// In loops
for (const item of items) {
  debugger;
  process(item);
}
```

### ✅ Good

```typescript
// Remove debugger
function process(data) {
  return transform(data);
}

// Use logging instead
import logger from './logger';

function process(data) {
  logger.debug('Processing data', { data });
  return transform(data);
}

// Use breakpoints in DevTools
// Set breakpoints in your IDE instead of inline debugger
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-debugger": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-debugger": [
      "error",
      {
        "allowInTests": false,
        "allowInDevelopment": false
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowInTests` | boolean | `false` | Allow debugger in test files (`**/*.test.ts`) |
| `allowInDevelopment` | boolean | `false` | Allow debugger when `NODE_ENV=development` |

## When to Disable

### Test Files

Debugging tests is sometimes acceptable:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-debugger": "off"
      }
    }
  ]
}
```

### Development-Only Code

```typescript
// Allowed with allowInDevelopment: true
if (process.env.NODE_ENV === 'development') {
  debugger; // Intentional dev breakpoint
}
```

### Debug Utilities

Some tools legitimately use debugger:

```json
{
  "overrides": [
    {
      "files": ["src/debug/**/*", "src/devtools/**/*"],
      "rules": {
        "no-debugger": "off"
      }
    }
  ]
}
```

## Related Rules

- [`no-console-log`](no-console-log.md) – Console logging
- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection
- [`no-unused-vars`](no-unused-vars.md) – Unused variables

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [MDN: debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) – debugger statement
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) – Browser debugging
- [VS Code Debugger](https://code.visualstudio.com/docs/editor/debugging) – IDE debugging
