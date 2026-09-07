# Rule: no-weak-crypto

**Category:** Security  
**Severity:** `error` (default)  
**Performance:** Low (pattern-based)

## Description

Detects use of weak or deprecated cryptographic algorithms (MD5, SHA1, DES, RC4, etc.).

## Why It Matters

Weak cryptography is easily broken:
- **MD5:** Collisions in seconds, completely broken
- **SHA1:** Practical collision attacks demonstrated
- **DES:** 56-bit key, brute-forceable in hours
- **RC4:** Multiple vulnerabilities, deprecated in TLS
- **MD4:** Even weaker than MD5, trivially broken

Using weak crypto for security purposes exposes your application to:
- **Data breaches:** Encrypted data can be decrypted
- **Forgery:** Hashes can be forged
- **Compliance failures:** PCI DSS, HIPAA, FIPS prohibit weak crypto

Use modern algorithms: SHA-256, SHA-3, AES-256, Argon2, bcrypt.

## Examples

### ❌ Bad

```typescript
// MD5 (completely broken)
import { createHash } from 'crypto';
const hash = createHash('md5').update(password).digest('hex');

// SHA1 (deprecated)
const hash = createHash('sha1').update(data).digest('hex');

// DES (weak key size)
const cipher = createCipheriv('des', key, iv);

// RC4 (broken stream cipher)
const cipher = createCipheriv('rc4', key, iv);

// MD4 (even worse than MD5)
const hash = createHash('md4').update(data).digest('hex');

// Password hashing (wrong algorithm)
const hash = createHash('sha256').update(password).digest('hex'); // Should use bcrypt/argon2
```

### ✅ Good

```typescript
// SHA-256 (secure for hashing)
import { createHash } from 'crypto';
const hash = createHash('sha256').update(data).digest('hex');

// SHA-3 (latest standard)
const hash = createHash('sha3-256').update(data).digest('hex');

// AES-256 (secure encryption)
import { createCipheriv, randomBytes } from 'crypto';
const cipher = createCipheriv('aes-256-gcm', key, iv);

// Password hashing (proper algorithm)
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);

// Password hashing (modern alternative)
import { hash } from 'argon2';
const hash = await hash(password);

// HMAC (authenticated hashing)
const hmac = createHmac('sha256', secret).update(data).digest('hex');
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-weak-crypto": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-weak-crypto": [
      "error",
      {
        "checkHashes": true,
        "checkCiphers": true,
        "checkKeyExchange": true,
        "allowLegacy": false,
        "allowedAlgorithms": ["sha256", "sha384", "sha512", "sha3-256", "aes-256-gcm"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkHashes` | boolean | `true` | Check hash algorithm usage |
| `checkCiphers` | boolean | `true` | Check encryption cipher usage |
| `checkKeyExchange` | boolean | `true` | Check key exchange algorithms |
| `allowLegacy` | boolean | `false` | Allow weak algorithms for legacy compatibility (not recommended) |
| `allowedAlgorithms` | string[] | `[]` | Explicit whitelist of allowed algorithms |

## Algorithms Detected

### Hash Functions (Weak)

- **MD4** – Completely broken, trivial collisions
- **MD5** – Broken, collisions in seconds
- **SHA1** – Deprecated, practical attacks
- **RIPEMD** – Weak, deprecated

### Hash Functions (Strong)

- **SHA-256, SHA-384, SHA-512** – Recommended
- **SHA-3** – Latest standard
- **BLAKE2** – Fast and secure

### Encryption (Weak)

- **DES** – 56-bit key, broken
- **3DES** – Deprecated, slow
- **RC4** – Broken stream cipher
- **RC2** – Weak block cipher
- **Blowfish** – 64-bit block, deprecated
- **IDEA** – Patented, weak

### Encryption (Strong)

- **AES-128, AES-192, AES-256** – Recommended (GCM mode preferred)
- **ChaCha20** – Modern alternative

### Password Hashing (Weak)

- **MD5, SHA1, SHA256** – Too fast, vulnerable to GPU attacks
- **Plain text** – Never store passwords unhashed

### Password Hashing (Strong)

- **bcrypt** – Industry standard
- **Argon2** – Modern, memory-hard
- **scrypt** – Memory-hard
- **PBKDF2** – Acceptable with high iterations

## When to Disable

### Legacy Compatibility

For interoperability with legacy systems (not recommended for new code):

```json
{
  "rules": {
    "no-weak-crypto": [
      "error",
      {
        "allowLegacy": true
      }
    ]
  }
}
```

### Non-Security Hashing

For checksums, not security (still not recommended):

```json
{
  "rules": {
    "no-weak-crypto": [
      "warn",
      {
        "checkHashes": false
      }
    ]
  }
}
```

## Migration Guide

### MD5/SHA1 → SHA-256

```typescript
// Before
const hash = createHash('md5').update(data).digest('hex');

// After
const hash = createHash('sha256').update(data).digest('hex');
```

### DES → AES-256

```typescript
// Before
const cipher = createCipheriv('des', key, iv);

// After
const cipher = createCipheriv('aes-256-gcm', key, iv);
```

### SHA256(password) → bcrypt

```typescript
// Before
const hash = createHash('sha256').update(password).digest('hex');

// After
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);
```

## Related Rules

- [`no-insecure-random`](no-insecure-random.md) – Weak randomness
- [`no-hardcoded-secrets`](no-hardcoded-secrets.md) – Exposed credentials
- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [NIST: Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) – Official guidelines
- [OWASP: Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) – Best practices
- [CWE-327: Weak Crypto](https://cwe.mitre.org/data/definitions/327.html) – Common weakness
