# Rule: no-mixed-languages

**Category:** Localization  
**Severity:** `warn` (default)  
**Performance:** Medium (language detection)

## Description

Detects multiple languages used in comments and strings within the same file.

## Why It Matters

Mixed languages in code indicate:
- **Inconsistent localization:** Team members using different languages
- **AI-generated code:** Models mixing training data languages
- **Copy-paste issues:** Code from different sources combined
- **Maintenance problems:** Harder for any single person to understand
- **Code quality:** Lack of standards enforcement

For international teams, pick one language (usually English) for code.

## Examples

### ❌ Bad

```typescript
// Mixed English and Spanish
// Initialize user data
const user = getUser();
// Obtener información del usuario
const info = fetchUserInfo(user.id);

// Mixed English and Chinese
/**
 * Process the order
 * @param order 订单对象
 */
function processOrder(order: Order) {
  // 验证订单
  validate(order);
  // Calculate total
  const total = calculateTotal(order);
}

// Mixed English and French
const message = 'Hello'; // Bonjour
const greeting = 'Welcome'; // Bienvenue
```

### ✅ Good

```typescript
// All English
// Initialize user data
const user = getUser();
// Fetch user information
const info = fetchUserInfo(user.id);

/**
 * Process the order
 * @param order Order object
 */
function processOrder(order: Order) {
  // Validate order
  validate(order);
  // Calculate total
  const total = calculateTotal(order);
}

// All Spanish (if team standard)
// Inicializar datos del usuario
const user = getUser();
// Obtener información del usuario
const info = fetchUserInfo(user.id);

// Using i18n for user-facing strings
const message = t('hello');
const greeting = t('welcome');
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-mixed-languages": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-mixed-languages": [
      "warn",
      {
        "primaryLanguage": "en",
        "allowedLanguages": ["en"],
        "checkComments": true,
        "checkStrings": false,
        "minLength": 5,
        "ignoreTechnicalTerms": true,
        "allowInTests": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `primaryLanguage` | string | `"en"` | Expected primary language (ISO 639-1) |
| `allowedLanguages` | string[] | `["en"]` | Languages allowed in code |
| `checkComments` | boolean | `true` | Check comments for mixed languages |
| `checkStrings` | boolean | `false` | Check string literals |
| `minLength` | number | `5` | Minimum text length to check |
| `ignoreTechnicalTerms` | boolean | `true` | Ignore technical terms (TODO, FIXME, etc.) |
| `allowInTests` | boolean | `true` | Allow mixed languages in test files |

## When to Disable

### International Projects

Projects with multilingual teams:

```json
{
  "rules": {
    "no-mixed-languages": "off"
  }
}
```

### Test Files

Test data may use various languages:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-mixed-languages": "off"
      }
    }
  ]
}
```

### i18n/L10n Code

Internationalization code itself:

```json
{
  "overrides": [
    {
      "files": ["src/i18n/**/*", "locales/**/*"],
      "rules": {
        "no-mixed-languages": "off"
      }
    }
  ]
}
```

## Related Rules

- [`detect-non-english`](detect-non-english.md) – Non-English detection
- [`require-i18n`](require-i18n.md) – Missing internationalization
- [`no-copy-paste-artifacts`](no-copy-paste-artifacts.md) – Copy-paste detection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [ISO 639-1 Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) – Language codes
- [i18next](https://www.i18next.com/) – Internationalization framework
- [Clean Code: Comments](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29) – Comment best practices
