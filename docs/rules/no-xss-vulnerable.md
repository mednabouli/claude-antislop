# Rule: no-xss-vulnerable

**Category:** Security  
**Severity:** `error` (default)  
**Performance:** Medium (AST + pattern analysis)

## Description

Detects code patterns vulnerable to Cross-Site Scripting (XSS) attacks.

## Why It Matters

XSS vulnerabilities allow attackers to:
- **Steal sessions:** Hijack user cookies and tokens
- **Phish users:** Display fake login forms
- **Deface sites:** Modify page content
- **Spread malware:** Redirect to malicious sites
- **Access data:** Read sensitive information from DOM

Always sanitize user input before rendering in HTML.

## Examples

### ❌ Bad

```typescript
// InnerHTML with user input
const userInput = request.query.name;
element.innerHTML = `<div>${userInput}</div>`;

// document.write
const comment = request.body.comment;
document.write(`<p>${comment}</p>`);

// dangerouslySetInnerHTML (React)
function Comment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}

// jQuery html() with user input
$('#container').html(userContent);

// eval with user data
const config = JSON.parse(userInput);
eval(config.callback);
```

### ✅ Good

```typescript
// Text content (auto-escaped)
const userInput = request.query.name;
element.textContent = userInput;

// createElement
const div = document.createElement('div');
div.textContent = userInput;
element.appendChild(div);

// React (auto-escaped by default)
function Comment({ text }) {
  return <div>{text}</div>; // Safe
}

// Sanitize before rendering
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Escape HTML entities
function escapeHtml(str: string): string {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-xss-vulnerable": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-xss-vulnerable": [
      "error",
      {
        "checkInnerHtml": true,
        "checkDocumentWrite": true,
        "checkDangerouslySetInnerHtml": true,
        "checkEval": true,
        "allowSanitized": true,
        "sanitizerLibraries": ["DOMPurify", "sanitize-html"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkInnerHtml` | boolean | `true` | Check innerHTML assignments |
| `checkDocumentWrite` | boolean | `true` | Check document.write calls |
| `checkDangerouslySetInnerHtml` | boolean | `true` | Check React dangerouslySetInnerHTML |
| `checkEval` | boolean | `true` | Check eval/Function with user data |
| `allowSanitized` | boolean | `true` | Allow if sanitized with known library |
| `sanitizerLibraries` | string[] | `["DOMPurify", "sanitize-html"]` | Recognized sanitizer libraries |

## Patterns Detected

### DOM Manipulation

```typescript
// Unsafe
el.innerHTML = userInput;
el.outerHTML = userInput;
document.write(userInput);

// Safe
el.textContent = userInput;
el.appendChild(document.createTextNode(userInput));
```

### React

```typescript
// Unsafe
<div dangerouslySetInnerHTML={{ __html: userHtml }} />

// Safe (with sanitization)
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userHtml) }} />

// Safe (default)
<div>{userText}</div>
```

### jQuery

```typescript
// Unsafe
$('#el').html(userInput);
$(`<div>${userInput}</div>`);

// Safe
$('#el').text(userInput);
$('<div>').text(userInput);
```

### Server-Side

```typescript
// Unsafe (Node.js)
res.send(`<html>${userInput}</html>`);

// Safe
res.send(escapeHtml(userInput));
```

## When to Disable

### Trusted Content Only

When content is guaranteed safe (e.g., from CMS with strict validation):

```json
{
  "overrides": [
    {
      "files": ["src/cms/**/*"],
      "rules": {
        "no-xss-vulnerable": "off"
      }
    }
  ]
}
```

### Sanitized Content

When using custom sanitization (configure `sanitizerLibraries`):

```json
{
  "rules": {
    "no-xss-vulnerable": [
      "error",
      {
        "allowSanitized": true,
        "sanitizerLibraries": ["DOMPurify", "myCustomSanitizer"]
      }
    ]
  }
}
```

## Related Rules

- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection
- [`no-sql-injection`](no-sql-injection.md) – SQL injection
- [`no-hardcoded-secrets`](no-hardcoded-secrets.md) – Secret exposure

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [OWASP: XSS](https://owasp.org/www-community/Top_10-Cross-Site_Scripting_(XSS)) – XSS prevention
- [DOMPurify](https://github.com/cure53/DOMPurify) – HTML sanitization library
- [CWE-79: XSS](https://cwe.mitre.org/data/definitions/79.html) – Common weakness
