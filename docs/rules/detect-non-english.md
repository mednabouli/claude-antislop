# Rule: detect-non-english

**Category:** Localization  
**Severity:** `warn` (default)  
**Performance:** Medium (pattern + language detection)

## Description

Detects non-English comments and string literals in source code.

## Why It Matters

Non-English code comments and strings can indicate:
- **AI-generated code:** Models sometimes output comments in training data languages
- **Inconsistent localization:** Mixed languages confuse international teams
- **Maintenance issues:** Non-English comments may not be understood by all contributors
- **Code quality:** May indicate copy-pasted code from foreign sources

For open-source projects, English is the standard language for code.

## Examples

### ❌ Bad

```typescript
// Chinese comments
// 这是一个测试函数
function test() {
  return 'test';
}

// Spanish strings
const message = 'Hola mundo';
const greeting = 'Buenos días';

// Mixed languages
/**
 * 用户认证函数
 * @param user 用户对象
 */
function authenticate(user: User) {
  return validate(user);
}

// Russian comments
// Это функция для обработки данных
function processData(data) {
  return data;
}
```

### ✅ Good

```typescript
// English comments
// This is a test function
function test() {
  return 'test';
}

// Localized strings (using i18n)
const message = t('hello_world');
const greeting = t('good_morning');

// English documentation
/**
 * User authentication function
 * @param user User object
 */
function authenticate(user: User) {
  return validate(user);
}

// Consistent language
// Data processing function
function processData(data) {
  return data;
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "detect-non-english": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "detect-non-english": [
      "warn",
      {
        "allowedLanguages": ["en"],
        "checkComments": true,
        "checkStrings": true,
        "minLength": 5,
        "ignorePatterns": ["name", "email", "id", "url"],
        "allowInTests": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowedLanguages` | string[] | `["en"]` | ISO 639-1 language codes to allow |
| `checkComments` | boolean | `true` | Check comments for non-English text |
| `checkStrings` | boolean | `false` | Check string literals (may have false positives) |
| `minLength` | number | `5` | Minimum text length to check |
| `ignorePatterns` | string[] | `[]` | Regex patterns to ignore (e.g., names, technical terms) |
| `allowInTests` | boolean | `true` | Allow non-English in test files |
| `confidenceThreshold` | number | `0.8` | Language detection confidence threshold |

## When to Disable

### International Projects

Projects targeting specific regions:

```json
{
  "rules": {
    "detect-non-english": "off"
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
        "detect-non-english": "off"
      }
    }
  ]
}
```

### String Literals

User-facing strings should use i18n, not be flagged:

```json
{
  "rules": {
    "detect-non-english": [
      "warn",
      {
        "checkStrings": false
      }
    ]
  }
}
```

## Related Rules

- [`require-i18n`](require-i18n.md) – Missing internationalization
- [`no-mixed-languages`](no-mixed-languages.md) – Multiple languages in same file
- [`no-copy-paste-artifacts`](no-copy-paste-artifacts.md) – Copy-paste detection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [ISO 639-1 Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) – Language codes
- [i18next](https://www.i18next.com/) – Internationalization framework
- [franc](https://github.com/wooorm/franc) – Language detection library
