# Rules Index

Complete reference for all Claude AntiSlop detection rules, organized by category.

## Overview

Claude AntiSlop includes **50+ detection rules** across 5 categories:

| Category | Rules | Description |
|----------|-------|-------------|
| **Slop** | 25 | AI-generated code patterns and anti-patterns |
| **Security** | 12 | Secrets, unsafe patterns, and vulnerabilities |
| **Quality** | 8 | Code quality and maintainability |
| **Style** | 5 | Code style and consistency |
| **Localization** | 3 | Multi-language and i18n issues |

## Quick Reference

### Error-Level Rules (Default)

These rules fail CI/CD by default:

- `no-placeholder-comments` – TODO/FIXME without context
- `no-hallucinated-imports` – Non-existent module imports
- `no-copy-paste-artifacts` – Duplicate code blocks
- `no-any-type` – Unsafe TypeScript `any` type
- `require-type-annotations` – Missing type annotations

### Warning-Level Rules (Default)

These warn but don't fail:

- `no-lazy-naming` – Generic names like `data`, `temp`, `obj`
- `no-console-log` – Debug logging in production code
- `max-function-length` – Functions over 50 lines
- `no-debugger` – Leftover debugger statements

## Rules by Category

### 🗑️ Slop Rules

AI-generated code patterns and anti-patterns.

| Rule | Severity | Description | Example |
|------|----------|-------------|---------|
| [`no-placeholder-comments`](rules/no-placeholder-comments.md) | error | Detects placeholder comments without context | `// TODO: implement this` |
| [`no-lazy-naming`](rules/no-lazy-naming.md) | warn | Generic, non-descriptive variable names | `const data = getData()` |
| [`no-hallucinated-imports`](rules/no-hallucinated-imports.md) | error | Imports from non-existent modules | `import { foo } from 'nonexistent'` |
| [`no-copy-paste-artifacts`](rules/no-copy-paste-artifacts.md) | error | Duplicate code blocks across files | Same 10+ lines in multiple files |
| [`no-todo-comments`](rules/no-todo-comments.md) | warn | TODO comments without issue reference | `// TODO: fix later` |
| [`no-fixme-comments`](rules/no-fixme-comments.md) | warn | FIXME comments without context | `// FIXME: this is broken` |
| [`no-boilerplate-intro`](rules/no-boilerplate-intro.md) | warn | AI-style introductory comments | `// This file contains...` |
| [`no-generic-error-handling`](rules/no-generic-error-handling.md) | error | Catch-all error handlers | `catch (e) { console.log(e) }` |
| [`no-magic-numbers`](rules/no-magic-numbers.md) | warn | Unexplained numeric literals | `if (status === 42)` |
| [`no-redundant-comments`](rules/no-redundant-comments.md) | warn | Comments that repeat the code | `// increment counter`<br>`counter++` |

### 🔒 Security Rules

Secrets, unsafe patterns, and vulnerabilities.

| Rule | Severity | Description | Example |
|------|----------|-------------|---------|
| [`no-hardcoded-secrets`](rules/no-hardcoded-secrets.md) | error | API keys, passwords, tokens in code | `const API_KEY = "sk-..."` |
| [`no-unsafe-eval`](rules/no-unsafe-eval.md) | error | Use of `eval()` or `Function()` | `eval(userInput)` |
| [`no-sql-injection`](rules/no-sql-injection.md) | error | String-concatenated SQL queries | `"SELECT * FROM users WHERE id=" + id` |
| [`no-xss-vulnerable`](rules/no-xss-vulnerable.md) | error | Unsanitized HTML interpolation | `innerHTML = userInput` |
| [`no-insecure-random`](rules/no-insecure-random.md) | error | `Math.random()` for security | `const token = Math.random()` |
| [`no-weak-crypto`](rules/no-weak-crypto.md) | error | MD5, SHA1, or deprecated algorithms | `crypto.createHash('md5')` |
| [`no-exposed-env-vars`](rules/no-exposed-env-vars.md) | warn | Sensitive env vars in client code | `process.env.DATABASE_URL` |
| [`no-console-in-prod`](rules/no-console-in-prod.md) | warn | Console methods in production | `console.log(debugInfo)` |
| [`no-prototype-pollution`](rules/no-prototype-pollution.md) | error | Unsafe object property assignment | `obj[userKey] = value` |
| [`no-command-injection`](rules/no-command-injection.md) | error | Unsanitized shell commands | `exec(`ls ${userInput}`)` |

### 📊 Quality Rules

Code quality and maintainability.

| Rule | Severity | Description | Example |
|------|----------|-------------|---------|
| [`require-type-annotations`](rules/require-type-annotations.md) | error | Missing TypeScript type annotations | `function add(a, b)` |
| [`no-any-type`](rules/no-any-type.md) | error | Unsafe `any` type usage | `const data: any` |
| [`max-function-length`](rules/max-function-length.md) | warn | Functions exceeding line limit | Function with 100+ lines |
| [`max-params`](rules/max-params.md) | warn | Too many function parameters | `function(a, b, c, d, e, f)` |
| [`complexity`](rules/complexity.md) | warn | High cyclomatic complexity | Nested conditionals >10 |
| [`no-duplicate-code`](rules/no-duplicate-code.md) | error | Duplicated code blocks | Same logic in multiple places |
| [`prefer-const`](rules/prefer-const.md) | warn | Variables that could be `const` | `let x = 5; x = 10;` (never reassigned) |
| [`no-unused-vars`](rules/no-unused-vars.md) | error | Declared but unused variables | `const unused = getValue()` |

### 🎨 Style Rules

Code style and consistency.

| Rule | Severity | Description | Example |
|------|----------|-------------|---------|
| [`no-var`](rules/no-var.md) | error | Use of `var` instead of `let`/`const` | `var x = 5` |
| [`no-console-log`](rules/no-console-log.md) | warn | Console logging in source code | `console.log('debug')` |
| [`no-debugger`](rules/no-debugger.md) | error | Leftover debugger statements | `debugger` |
| [`prefer-arrow-functions`](rules/prefer-arrow-functions.md) | warn | Prefer arrow over function expressions | `function(x) { return x }` |
| [`no-trailing-spaces`](rules/no-trailing-spaces.md) | warn | Trailing whitespace | `const x = 5␣␣` |

### 🌐 Localization Rules

Multi-language and i18n issues.

| Rule | Severity | Description | Example |
|------|----------|-------------|---------|
| [`detect-non-english`](rules/detect-non-english.md) | warn | Non-English comments or strings | `// 这是一个测试` |
| [`require-i18n`](rules/require-i18n.md) | warn | Hardcoded user-facing strings | `return "Hello"` |
| [`no-mixed-languages`](rules/no-mixed-languages.md) | warn | Multiple languages in same file | English + Spanish comments |

## Configuration

### Enable/Disable Rules

In `.antisloprc.json`:

```json
{
  "rules": {
    "no-placeholder-comments": "error",
    "no-lazy-naming": "warn",
    "no-any-type": "off"
  }
}
```

### Severity Levels

- `"error"` – Fails CI/CD, exit code 1
- `"warn"` – Shows warning, doesn't fail (unless `failOnWarning: true`)
- `"off"` – Rule disabled

### Rule Options

Some rules accept configuration:

```json
{
  "rules": {
    "max-function-length": ["warn", { "max": 50 }],
    "max-params": ["error", { "max": 4 }],
    "complexity": ["warn", { "max": 10 }]
  }
}
```

### Overrides by Path

Apply different rules to different files:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-console-log": "off",
        "no-any-type": "off"
      }
    },
    {
      "files": ["src/api/**/*"],
      "rules": {
        "no-console-log": "error",
        "require-type-annotations": "error"
      }
    }
  ]
}
```

## Disabling Rules Inline

### Disable for Single Line

```typescript
// antislop-disable-next-line no-lazy-naming
const data1 = getData();
```

### Disable for Multiple Lines

```typescript
/* antislop-disable-next-line no-lazy-naming */
const data1 = getData();
const data2 = getData2();
```

### Disable Entire File

```typescript
/* antislop-disable-file */
// All rules disabled in this file
```

### Disable Specific Rule in File

```typescript
/* antislop-disable no-console-log */
console.log('debug');
/* antislop-enable no-console-log */
```

## Writing Custom Rules

See [ARCHITECTURE.md](../ARCHITECTURE.md#adding-new-rules) for guide on creating custom rules.

Example custom rule:

```typescript
// rules/custom/my-rule.ts
export const myRule: Rule = {
  id: 'my-custom-rule',
  name: 'My Custom Rule',
  description: 'Detects specific patterns',
  severity: 'warn',
  category: 'slop',
  check: (file: File): Diagnostic[] => {
    // Your detection logic
    return [];
  },
};
```

## Rule Categories Explained

### Slop

Patterns commonly found in AI-generated code:
- Placeholder comments without context
- Lazy, non-descriptive naming
- Hallucinated imports from non-existent modules
- Copy-paste artifacts and duplicates
- Boilerplate introductions
- Generic error handling

### Security

Vulnerabilities and unsafe patterns:
- Hardcoded secrets (API keys, passwords, tokens)
- Unsafe `eval()` and `Function()` usage
- SQL injection vulnerabilities
- XSS-vulnerable code
- Insecure random number generation
- Weak cryptographic algorithms
- Command injection risks

### Quality

Maintainability and best practices:
- Missing type annotations
- Unsafe `any` types
- Overly long functions
- Too many parameters
- High cyclomatic complexity
- Duplicate code
- Unused variables

### Style

Code consistency:
- `var` vs `let`/`const`
- Console logging
- Debugger statements
- Arrow function preferences
- Trailing whitespace

### Localization

Internationalization:
- Non-English comments and strings
- Missing i18n for user-facing text
- Mixed languages in same file

## Performance Impact

Rules have varying performance costs:

| Cost | Rules | Impact |
|------|-------|--------|
| **Low** | Pattern-based rules (regex) | <0.1ms/file |
| **Medium** | AST-based rules | 0.5-1ms/file |
| **High** | Cross-file analysis | 2-5ms/file |

See [BENCHMARKS.md](BENCHMARKS.md) for detailed performance data.

## Troubleshooting

### False Positives

If a rule flags valid code:

1. Use inline disable: `// antislop-disable-next-line rule-name`
2. Add file to exclude patterns
3. Lower severity to `"warn"` or `"off"`
4. Report issue on GitHub

### Missing Detections

If AI slop isn't caught:

1. Check rule is enabled
2. Verify file matches include patterns
3. Try `--verbose` flag for debug output
4. Report as bug with example code

### Performance Issues

If checks are slow:

1. Disable high-cost rules you don't need
2. Add comprehensive exclude patterns
3. Reduce `maxWorkers` if CPU-bound
4. Check [BENCHMARKS.md](BENCHMARKS.md) for optimization tips

## See Also

- [Usage Guide](USAGE.md) – Configuration and examples
- [CLI Reference](CLI.md) – Command-line options
- [ARCHITECTURE.md](../ARCHITECTURE.md) – Technical deep dive
- [BENCHMARKS.md](BENCHMARKS.md) – Performance data
- [RECIPES.md](../RECIPES.md) – Common workflows

---

**Last Updated:** September 2026 | **Version:** 1.0.0
