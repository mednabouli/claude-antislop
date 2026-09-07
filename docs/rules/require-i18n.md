# Rule: require-i18n

**Category:** Localization  
**Severity:** `warn` (default)  
**Performance:** Low (pattern-based)

## Description

Detects hardcoded user-facing strings that should be internationalized.

## Why It Matters

Hardcoded strings prevent internationalization:
- **No i18n:** Cannot translate to other languages
- **Poor UX:** Non-English users can't use your app
- **Maintenance:** Changing strings requires code changes
- **AI slop:** AI models often hardcode English strings

Use i18n libraries (i18next, react-intl, formatjs) for user-facing text.

## Examples

### ❌ Bad

```typescript
// Hardcoded UI strings
return <button>Submit</button>;
return <h1>Welcome to our app</h1>;
alert('Operation successful!');
toast('Item saved successfully');

// Error messages
throw new Error('Invalid email address');
return 'User not found';

// Labels
<label>Email Address</label>
<input placeholder="Enter your name" />

// Messages
const message = 'Thank you for your purchase!';
const error = 'An error occurred. Please try again.';
```

### ✅ Good

```typescript
// Using i18next
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  
  return (
    <>
      <button>{t('submit')}</button>
      <h1>{t('welcome')}</h1>
    </>
  );
}

// Error messages with codes
throw new AppError('INVALID_EMAIL', { email });
return t('errors.user_not_found');

// Labels
<label>{t('labels.email')}</label>
<input placeholder={t('placeholders.enter_name')} />

// Messages
const message = t('messages.thank_you');
const error = t('errors.generic');
```

## Configuration

### Basic

```json
{
  "rules": {
    "require-i18n": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "require-i18n": [
      "warn",
      {
        "checkJSX": true,
        "checkAlerts": true,
        "checkErrors": true,
        "minLength": 5,
        "allowPatterns": ["^https?://", "^@[\w-]+", "^#[\w-]+"],
        "ignoreFiles": ["**/*.test.ts", "src/i18n/**/*"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkJSX` | boolean | `true` | Check JSX text and attributes |
| `checkAlerts` | boolean | `true` | Check alert(), confirm(), prompt() calls |
| `checkErrors` | boolean | `true` | Check Error constructor messages |
| `minLength` | number | `5` | Minimum string length to check |
| `allowPatterns` | string[] | `[]` | Regex patterns to allow (URLs, mentions, etc.) |
| `ignoreFiles` | string[] | `[]` | Files to skip (i18n config, tests, etc.) |
| `allowedStrings` | string[] | `[]` | Specific strings to allow (e.g., brand names) |

## When to Disable

### Non-UI Code

Backend code, utilities, etc.:

```json
{
  "overrides": [
    {
      "files": ["src/utils/**/*", "src/lib/**/*"],
      "rules": {
        "require-i18n": "off"
      }
    }
  ]
}
```

### Test Files

Test assertions may check exact strings:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "require-i18n": "off"
      }
    }
  ]
}
```

### i18n Configuration Files

Translation files themselves:

```json
{
  "overrides": [
    {
      "files": ["src/i18n/**/*", "locales/**/*"],
      "rules": {
        "require-i18n": "off"
      }
    }
  ]
}
```

## Related Rules

- [`detect-non-english`](detect-non-english.md) – Non-English text
- [`no-mixed-languages`](no-mixed-languages.md) – Mixed languages
- [`no-hardcoded-secrets`](no-hardcoded-secrets.md) – Hardcoded values

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [i18next](https://www.i18next.com/) – Internationalization framework
- [react-intl](https://formatjs.io/docs/react-intl/) – React i18n library
- [FormatJS](https://formatjs.io/) – i18n library
