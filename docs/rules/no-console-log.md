# Rule: no-console-log

**Category:** Style  
**Severity:** `warn` (default)  
**Performance:** Low (AST-based)

## Description

Detects usage of `console.log()` and related console methods in source code.

## Why It Matters

Console logging in production code is problematic:
- **Performance:** Console I/O is slow, especially in loops
- **Security:** May leak sensitive data to browser console or logs
- **Noise:** Clutters logs, making debugging harder
- **Code quality:** Indicates incomplete error handling or debugging leftovers
- **AI slop:** AI models often add console.log as lazy debugging

Use proper logging libraries (winston, pino, bunyan) instead.

## Examples

### ❌ Bad

```typescript
// Debug logging
console.log('User data:', user);
console.log('API response:', response);

// In functions
function process(data) {
  console.log('Processing...', data);
  return data;
}

// In catch blocks
try {
  await apiCall();
} catch (error) {
  console.log(error);
}

// Other console methods
console.debug('Debug info');
console.info('Info message');
console.warn('Warning');
console.error('Error');
console.trace('Stack trace');
```

### ✅ Good

```typescript
// Proper logging library
import logger from './logger';
logger.info('User authenticated', { userId: user.id });
logger.error('API call failed', { error, context });

// Remove debug logs
function process(data) {
  return data; // No logging
}

// Proper error handling
try {
  await apiCall();
} catch (error) {
  logger.error('API call failed', { error, stack: error.stack });
  throw error; // Or handle appropriately
}

// Intentional console (CLI tools)
if (process.env.NODE_ENV === 'development') {
  console.log('Dev mode enabled');
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-console-log": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-console-log": [
      "warn",
      {
        "allow": ["warn", "error"],
        "disallow": ["log", "debug", "info", "trace"],
        "allowInTests": true,
        "allowInDevelopment": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allow` | string[] | `[]` | Console methods to allow (e.g., `["error", "warn"]`) |
| `disallow` | string[] | `["log"]` | Console methods to disallow |
| `allowInTests` | boolean | `false` | Allow console in test files (`**/*.test.ts`) |
| `allowInDevelopment` | boolean | `false` | Allow console when `NODE_ENV=development` |
| `allowPatterns` | string[] | `[]` | Regex patterns to allow (e.g., specific files) |

## Console Methods

### Disallowed by Default

- `console.log()` – General logging
- `console.debug()` – Debug messages
- `console.info()` – Informational messages
- `console.trace()` – Stack traces

### Sometimes Allowed

- `console.warn()` – Warnings (often acceptable)
- `console.error()` – Errors (often acceptable)
- `console.table()` – Debugging (should be removed)
- `console.time()` / `console.timeEnd()` – Performance (should be removed)

## When to Disable

### CLI Tools

CLI applications legitimately use console output:

```json
{
  "overrides": [
    {
      "files": ["cli/**/*"],
      "rules": {
        "no-console-log": "off"
      }
    }
  ]
}
```

### Test Files

Tests may use console for debugging:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "rules": {
        "no-console-log": "off"
      }
    }
  ]
}
```

### Development-Only Code

```typescript
// Allowed with allowInDevelopment: true
if (process.env.NODE_ENV === 'development') {
  console.log('Dev tools enabled');
}
```

## Related Rules

- [`no-debugger`](no-debugger.md) – Debugger statements
- [`no-console-in-prod`](no-console-in-prod.md) – Console in production code
- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Node.js Console](https://nodejs.org/api/console.html) – Console API
- [Winston Logger](https://github.com/winstonjs/winston) – Production logging
- [Pino Logger](https://github.com/pinojs/pino) – Fast logging
