# Rule: no-unsafe-eval

**Category:** Security  
**Severity:** `error` (default)  
**Performance:** Low (AST-based)

## Description

Detects use of `eval()`, `Function()`, and other dynamic code execution patterns that can lead to code injection vulnerabilities.

## Why It Matters

`eval()` and related functions are extremely dangerous:
- **Code injection:** User input can execute arbitrary code
- **XSS attacks:** Client-side eval leads to cross-site scripting
- **RCE vulnerabilities:** Server-side eval enables remote code execution
- **No static analysis:** Code inside eval can't be analyzed or optimized
- **Performance penalty:** JavaScript engines can't optimize eval

These functions should **never** be used with untrusted input.

## Examples

### ❌ Bad

```typescript
// Direct eval
const result = eval(userInput);
eval(`console.log(${data})`);

// Indirect eval
const myEval = eval;
myEval(userInput);

// Function constructor
const fn = new Function('a', 'b', 'return a + b');
const dynamicFn = Function(userInput);

// setTimeout/setInterval with string
setTimeout("doSomething()", 1000);
setInterval(userInput, 100);

// document.write with user input
document.write(`<script>${userScript}</script>`);
```

### ✅ Good

```typescript
// Use JSON.parse instead of eval for JSON
const data = JSON.parse(jsonString);

// Use function references instead of strings
setTimeout(doSomething, 1000);
setInterval(updateClock, 100);

// Use template literals safely
const output = escapeHtml(userInput);

// Use safe alternatives
import { parseExpression } from 'expr-eval';
const result = parseExpression(expression, context);

// Use Function with trusted code only
const add = new Function('a', 'b', 'return a + b'); // No user input
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-unsafe-eval": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-unsafe-eval": [
      "error",
      {
        "allowSafePatterns": false,
        "checkSetTimeout": true,
        "checkSetInterval": true,
        "checkDocumentWrite": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowSafePatterns` | boolean | `false` | Allow eval with static string literals (not recommended) |
| `checkSetTimeout` | boolean | `true` | Check setTimeout/setInterval with string arguments |
| `checkSetInterval` | boolean | `true` | Check setInterval with string arguments |
| `checkDocumentWrite` | boolean | `true` | Check document.write for script injection |

## Patterns Detected

### Direct eval

```typescript
eval(code);
eval(userInput);
eval(`template ${variable}`);
```

### Function constructor

```typescript
new Function('a', 'b', 'return a + b');
Function(userInput);
const fn = Function(code);
```

### Indirect eval

```typescript
const e = eval;
e(code);

window['eval'](code);
this.eval(code);
```

### setTimeout/setInterval

```typescript
setTimeout("code()", 1000);
setInterval(userInput, 100);
```

### document.write

```typescript
document.write(`<script>${code}</script>`);
document.write(eval(expression));
```

## When to Disable

**Almost never.** The only acceptable cases:

- **Controlled environments:** REPL tools with sandboxed execution
- **Template engines:** With strict input sanitization (still risky)
- **Educational code:** Demonstrating why eval is dangerous

```json
{
  "overrides": [
    {
      "files": ["src/repl/**/*"],
      "rules": {
        "no-unsafe-eval": "off"
      }
    }
  ]
}
```

## Safer Alternatives

### For JSON Parsing

```typescript
// ❌ Bad
const data = eval(`(${jsonString})`);

// ✅ Good
const data = JSON.parse(jsonString);
```

### For Dynamic Code

```typescript
// ❌ Bad
const result = eval(expression);

// ✅ Good
import { parseExpression } from 'expr-eval';
const result = parseExpression(expression, { x: 1, y: 2 });
```

### For Template Execution

```typescript
// ❌ Bad
eval(`return ${template}(${data})`);

// ✅ Good
import Handlebars from 'handlebars';
const template = Handlebars.compile(templateString);
const result = template(data);
```

### For Dynamic Property Access

```typescript
// ❌ Bad
const value = eval(`obj.${userProperty}`);

// ✅ Good
const value = obj[userProperty];
```

## Related Rules

- [`no-command-injection`](no-command-injection.md) – Shell command injection
- [`no-xss-vulnerable`](no-xss-vulnerable.md) – XSS vulnerabilities
- [`no-sql-injection`](no-sql-injection.md) – SQL injection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [MDN: eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) – Why eval is dangerous
- [OWASP: Code Injection](https://owasp.org/www-community/Code_Injection) – Injection attacks
- [CWE-95: Improper Neutralization of Eval](https://cwe.mitre.org/data/definitions/95.html) – Common weakness
