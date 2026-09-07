# Rule: no-insecure-random

**Category:** Security  
**Severity:** `error` (default)  
**Performance:** Low (AST-based)

## Description

Detects use of insecure random number generators (`Math.random()`) for security-sensitive purposes.

## Why It Matters

`Math.random()` is NOT cryptographically secure:
- **Predictable:** Uses deterministic algorithm
- **Seedable:** Can be reproduced if seed is known
- **Not uniform:** Distribution biases in some implementations
- **Security risk:** Attackers can predict "random" values

For security tokens, passwords, salts, and cryptographic keys, use `crypto.randomBytes()` or `crypto.randomUUID()`.

## Examples

### ❌ Bad

```typescript
// Password generation
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Token generation
const token = Math.random().toString(36).substring(2);

// Session ID
const sessionId = Math.random().toString(16).substring(2);

// Cryptographic salt
const salt = Math.random().toString();

// CSRF token
const csrfToken = Math.random().toString(36).substr(2);
```

### ✅ Good

```typescript
// Password generation (secure)
import { randomBytes } from 'crypto';

function generatePassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  return Array.from(bytes)
    .map(b => chars[b % chars.length])
    .join('');
}

// Token generation (secure)
import { randomUUID } from 'crypto';
const token = randomUUID();

// Session ID (secure)
import { randomBytes } from 'crypto';
const sessionId = randomBytes(32).toString('hex');

// Salt (secure)
import { randomBytes } from 'crypto';
const salt = randomBytes(16).toString('hex');

// CSRF token (secure)
import { randomBytes } from 'crypto';
const csrfToken = randomBytes(32).toString('hex');
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-insecure-random": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-insecure-random": [
      "error",
      {
        "allowInTests": true,
        "allowNonSecurityContext": true,
        "strictMode": false
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowInTests` | boolean | `true` | Allow Math.random in test files |
| `allowNonSecurityContext` | boolean | `false` | Allow in non-security contexts (animations, games) |
| `strictMode` | boolean | `false` | Flag ALL Math.random usage (not recommended) |

## Patterns Detected

### Token Generation

```typescript
// Insecure
const token = Math.random().toString(36);
const id = Math.random().toString(16);

// Secure
import { randomUUID } from 'crypto';
const token = randomUUID();
```

### Password/Key Generation

```typescript
// Insecure
const password = chars[Math.floor(Math.random() * chars.length)];

// Secure
import { randomBytes } from 'crypto';
const byte = randomBytes(1)[0];
```

### Unique IDs

```typescript
// Insecure (for security purposes)
const userId = Math.random().toString(36).substring(2);

// Secure
import { randomUUID } from 'crypto';
const userId = randomUUID();

// Safe (for non-security IDs)
const displayId = Math.random().toString(36).substring(2); // OK for UI-only IDs
```

## When to Disable

### Non-Security Contexts

For games, animations, UI effects where predictability is acceptable:

```json
{
  "rules": {
    "no-insecure-random": [
      "error",
      {
        "allowNonSecurityContext": true
      }
    ]
  }
}
```

```typescript
// Acceptable for non-security use
const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
const animationDelay = Math.random() * 1000;
const shuffleIndex = Math.floor(Math.random() * array.length);
```

### Test Files

Tests may use Math.random for fixtures:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-insecure-random": "off"
      }
    }
  ]
}
```

## Secure Alternatives

### Node.js Crypto

```typescript
import { randomBytes, randomUUID, randomInt } from 'crypto';

// Random bytes
const bytes = randomBytes(32);

// UUID v4
const uuid = randomUUID();

// Random integer in range
const num = randomInt(0, 100);

// Async version
const { randomBytes } = await import('crypto');
```

### Web Crypto API

```typescript
// Browser environment
const array = new Uint32Array(1);
crypto.getRandomValues(array);
const random = array[0] / (0xFFFFFFFF + 1);

// Generate UUID (modern browsers)
const uuid = crypto.randomUUID();
```

### Libraries

```typescript
// nanoid
import { nanoid } from 'nanoid';
const id = nanoid(); // "V1StGXR8_Z5jdHi6B-myT"

// uuid
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();

// uid-safe
import { uid } from 'uid-safe';
const id = await uid(24);
```

## Related Rules

- [`no-weak-crypto`](no-weak-crypto.md) – Weak cryptographic algorithms
- [`no-hardcoded-secrets`](no-hardcoded-secrets.md) – Hardcoded credentials
- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Node.js Crypto](https://nodejs.org/api/crypto.html) – Secure random generation
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) – Browser crypto
- [OWASP: Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) – Cryptographic storage
