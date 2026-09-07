# Rule: no-console-in-prod

**Category:** Security  
**Severity:** `warn` (default)  
**Performance:** Low (AST-based)

## Description

Detects console usage that may leak to production builds.

## Why It Matters

Console statements in production code can:
- **Leak sensitive data:** User info, tokens, internal state visible in browser console
- **Impact performance:** Console I/O is slow, especially in loops
- **Aid attackers:** Debug output helps attackers understand your app
- **Pollute logs:** Production logging systems get noisy
- **Indicate incomplete cleanup:** Debug code left in production

Use proper logging libraries with environment-based filtering.

## Examples

### ❌ Bad

```typescript
// Debug logging in production code
function authenticate(user: User) {
  console.log('Authenticating user:', user);
  console.log('Token:', user.token);
  return validate(user);
}

// Error logging (use proper logger)
try {
  riskyOperation();
} catch (error) {
  console.error('Error occurred:', error);
}

// Performance logging
console.time('operation');
doSomething();
console.timeEnd('operation');
```

### ✅ Good

```typescript
// Proper logging library
import logger from './logger';

function authenticate(user: User) {
  logger.debug('Authenticating user', { userId: user.id });
  return validate(user);
}

// Error handling with logger
try {
  riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error, context: 'authenticate' });
  throw error;
}

// Environment-gated logging
if (process.env.NODE_ENV === 'development') {
  console.log('Dev mode:', debugInfo);
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-console-in-prod": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-console-in-prod": [
      "warn",
      {
        "allow": ["warn", "error"],
        "disallow": ["log", "debug", "info", "trace", "time", "timeEnd"],
        "allowInDevelopment": true,
        "allowInTests": true,
        "checkConsoleTime": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allow` | string[] | `["warn", "error"]` | Console methods to allow |
| `disallow` | string[] | `[]` | Console methods to explicitly disallow |
| `allowInDevelopment` | boolean | `true` | Allow console in development mode |
| `allowInTests` | boolean | `true` | Allow console in test files |
| `checkConsoleTime` | boolean | `true` | Check console.time/timeEnd calls |

## When to Disable

### CLI Tools

CLI applications legitimately use console:

```json
{
  "overrides": [
    {
      "files": ["cli/**/*"],
      "rules": {
        "no-console-in-prod": "off"
      }
    }
  ]
}
```

### Development-Only Code

```typescript
// Allowed with allowInDevelopment: true
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### Error Reporting

Some teams allow console.error for error reporting:

```json
{
  "rules": {
    "no-console-in-prod": [
      "warn",
      {
        "allow": ["error"]
      }
    ]
  }
}
```

## Related Rules

- [`no-console-log`](no-console-log.md) – General console usage
- [`no-debugger`](no-debugger.md) – Debugger statements
- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Winston Logger](https://github.com/winstonjs/winston) – Production logging
- [Pino Logger](https://github.com/pinojs/pino) – Fast logging
- [Log levels best practices](https://www.loggly.com/blog/logging-best-practices/) – Logging guide
