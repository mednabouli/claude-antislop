# Rules Documentation

Individual documentation for each Claude AntiSlop detection rule.

## Categories

- **[Slop Rules](../RULES.md#-slop-rules)** – AI-generated code patterns
- **[Security Rules](../RULES.md#-security-rules)** – Secrets and vulnerabilities
- **[Quality Rules](../RULES.md#-quality-rules)** – Code maintainability
- **[Style Rules](../RULES.md#-style-rules)** – Code consistency
- **[Localization Rules](../RULES.md#-localization-rules)** – Multi-language issues

## Available Rules

### Slop

- [`no-placeholder-comments`](no-placeholder-comments.md) – Placeholder comments
- [`no-lazy-naming`](no-lazy-naming.md) – Generic variable names
- [`no-hallucinated-imports`](no-hallucinated-imports.md) – Non-existent imports
- [`no-copy-paste-artifacts`](no-copy-paste-artifacts.md) – Duplicate code
- [`no-todo-comments`](no-todo-comments.md) – TODO without context
- [`no-fixme-comments`](no-fixme-comments.md) – FIXME comments
- [`no-boilerplate-intro`](no-boilerplate-intro.md) – AI intros
- [`no-generic-error-handling`](no-generic-error-handling.md) – Catch-all errors
- [`no-magic-numbers`](no-magic-numbers.md) – Unexplained numbers
- [`no-redundant-comments`](no-redundant-comments.md) – Obvious comments

### Security

- [`no-hardcoded-secrets`](no-hardcoded-secrets.md) – API keys and passwords
- [`no-unsafe-eval`](no-unsafe-eval.md) – eval() usage
- [`no-sql-injection`](no-sql-injection.md) – SQL injection risks
- [`no-xss-vulnerable`](no-xss-vulnerable.md) – XSS vulnerabilities
- [`no-insecure-random`](no-insecure-random.md) – Weak randomness
- [`no-weak-crypto`](no-weak-crypto.md) – Deprecated algorithms
- [`no-exposed-env-vars`](no-exposed-env-vars.md) – Exposed env vars
- [`no-console-in-prod`](no-console-in-prod.md) – Console in production
- [`no-prototype-pollution`](no-prototype-pollution.md) – Prototype pollution
- [`no-command-injection`](no-command-injection.md) – Command injection

### Quality

- [`require-type-annotations`](require-type-annotations.md) – Missing types
- [`no-any-type`](no-any-type.md) – Unsafe any type
- [`max-function-length`](max-function-length.md) – Long functions
- [`max-params`](max-params.md) – Too many params
- [`complexity`](complexity.md) – Cyclomatic complexity
- [`no-duplicate-code`](no-duplicate-code.md) – Duplicated logic
- [`prefer-const`](prefer-const.md) – Use const
- [`no-unused-vars`](no-unused-vars.md) – Unused variables

### Style

- [`no-var`](no-var.md) – Avoid var
- [`no-console-log`](no-console-log.md) – Console logging
- [`no-debugger`](no-debugger.md) – Debugger statements
- [`prefer-arrow-functions`](prefer-arrow-functions.md) – Arrow functions
- [`no-trailing-spaces`](no-trailing-spaces.md) – Trailing whitespace

### Localization

- [`detect-non-english`](detect-non-english.md) – Non-English text
- [`require-i18n`](require-i18n.md) – Missing i18n
- [`no-mixed-languages`](no-mixed-languages.md) – Mixed languages

## Usage

See [RULES.md](../RULES.md) for:
- Complete rules index
- Configuration examples
- Severity levels
- Inline disables
- Custom rules guide

## Contributing

To add a new rule:

1. Create rule file in `rules/src/`
2. Add documentation in `docs/rules/`
3. Update [RULES.md](../RULES.md) index
4. Add tests in `tests/rules/`

See [ARCHITECTURE.md](../../ARCHITECTURE.md) for implementation guide.

---

**Last Updated:** September 2026 | **Version:** 1.0.0
