# Rule: no-hardcoded-secrets

**Category:** Security  
**Severity:** `error` (default)  
**Performance:** Low (pattern-based)

## Description

Detects hardcoded secrets such as API keys, passwords, tokens, and credentials in source code.

## Why It Matters

Hardcoded secrets are a critical security vulnerability:
- **Accidental exposure:** Committed to Git, visible in history
- **Credential theft:** Attackers scan GitHub for leaked keys
- **No rotation:** Hardcoded credentials rarely get rotated
- **Privilege escalation:** Leaked admin keys compromise entire systems

Never commit secrets to version control. Use environment variables or secret management services.

## Examples

### ❌ Bad

```typescript
// API Keys
const API_KEY = "sk-1234567890abcdef";
const apiKey = "AIzaSyD1234567890";

// Passwords
const DB_PASSWORD = "supersecret123";
const password = "admin123";

// Tokens
const JWT_SECRET = "my-super-secret-jwt-key";
const accessToken = "ghp_1234567890abcdef";

// AWS Credentials
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// Private Keys
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy...
-----END RSA PRIVATE KEY-----`;
```

### ✅ Good

```typescript
// Environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Secret management services
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
const secret = await secretsManager.getSecretValue({ SecretId: 'prod/db/password' });

// Configuration files (gitignored)
import config from './config.json'; // config.json in .gitignore
const apiKey = config.apiKey;
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-hardcoded-secrets": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-hardcoded-secrets": [
      "error",
      {
        "checkStrings": true,
        "checkVariables": true,
        "allowTestFiles": true,
        "ignorePatterns": ["example", "placeholder", "your_", "xxx"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkStrings` | boolean | `true` | Check string literals for secret patterns |
| `checkVariables` | boolean | `true` | Check variable assignments |
| `allowTestFiles` | boolean | `false` | Allow secrets in test files (`**/*.test.ts`) |
| `ignorePatterns` | string[] | `[]` | Regex patterns to ignore (e.g., placeholders) |
| `minEntropy` | number | `4.5` | Minimum entropy threshold for random strings |

## Patterns Detected

### API Keys

- `sk-*`, `pk-*` (Stripe, OpenAI)
- `AIza*` (Google)
- `ghp_*`, `gho_*` (GitHub)
- `xoxb-*`, `xoxp-*` (Slack)
- `SG.*` (SendGrid)

### Cloud Credentials

- AWS Access Keys: `AKIA*`
- AWS Secret Keys: 40-char base64
- Azure Storage Keys: 88-char base64
- GCP Service Accounts: JSON with `private_key`

### Tokens

- JWT secrets: 32+ char strings
- OAuth tokens: `ya29.*` (Google)
- Bearer tokens: Long alphanumeric strings

### Database

- Connection strings with passwords: `mongodb://user:pass@host`
- DSN strings: `postgres://user:pass@host/db`

### Private Keys

- RSA/EC/DSA private key headers
- SSH private keys: `-----BEGIN OPENSSH PRIVATE KEY-----`

## When to Disable

- **Test fixtures:** Mock data in test files
- **Example code:** Documentation with placeholder values
- **Encrypted secrets:** Encrypted config (e.g., Travis CI encrypted vars)

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "rules": {
        "no-hardcoded-secrets": "off"
      }
    },
    {
      "files": ["docs/**/*", "examples/**/*"],
      "rules": {
        "no-hardcoded-secrets": "warn"
      }
    }
  ]
}
```

## Remediation

1. **Remove immediately:** Delete the secret from code
2. **Rotate credentials:** Generate new keys, revoke old ones
3. **Use environment variables:** `process.env.API_KEY`
4. **Use secret managers:** AWS Secrets Manager, HashiCorp Vault
5. **Scan Git history:** Use `git-secrets` or `truffleHog` to find historical leaks
6. **Add to .gitignore:** Ensure `.env`, `config.json`, etc. are ignored

## Related Rules

- [`no-exposed-env-vars`](no-exposed-env-vars.md) – Client-side env vars
- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection risks
- [`no-insecure-random`](no-insecure-random.md) – Weak randomness

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Security Audit](../docs/SECURITY.md) – Security scanning guide
- [GitGuardian](https://github.com/GitGuardian/ggshield) – Git secret scanning
- [12 Factor App: Config](https://12factor.net/config) – Store config in environment
