# Rules

This directory contains the detection rule definitions for Claude AntiSlop.

## Structure

```
rules/
├── src/
│   ├── index.ts          # Rule registry and exports
│   ├── patterns/         # Pattern-based rules (regex)
│   ├── ast/              # AST-based rules (TypeScript parser)
│   ├── security/         # Security-focused rules
│   ├── quality/          # Quality and maintainability rules
│   └── localization/     # Multi-language detection
├── README.md             # This file
└── tests/                # Rule tests
```

## Rule Types

### Pattern Rules (`src/patterns/`)

Regex-based detection for simple patterns:

```typescript
// src/patterns/no-placeholder-comments.ts
export const noPlaceholderComments: Rule = {
  id: 'no-placeholder-comments',
  name: 'No Placeholder Comments',
  pattern: /\/\/\s*(TODO|FIXME|XXX|HACK):?\s*$/i,
  severity: 'error',
  category: 'slop',
};
```

### AST Rules (`src/ast/`)

TypeScript AST analysis for complex patterns:

```typescript
// src/ast/no-lazy-naming.ts
export const noLazyNaming: Rule = {
  id: 'no-lazy-naming',
  name: 'No Lazy Naming',
  severity: 'warn',
  category: 'slop',
  check: (node: ts.Node, file: File): Diagnostic[] => {
    // AST traversal and analysis
    return [];
  },
};
```

### Security Rules (`src/security/`)

Security-focused detection:

```typescript
// src/security/no-hardcoded-secrets.ts
export const noHardcodedSecrets: Rule = {
  id: 'no-hardcoded-secrets',
  name: 'No Hardcoded Secrets',
  severity: 'error',
  category: 'security',
  patterns: [
    /api[_-]?key\s*=\s*["'][^"']+["']/i,
    /password\s*=\s*["'][^"']+["']/i,
    /secret\s*=\s*["'][^"']+["']/i,
  ],
};
```

## Adding New Rules

1. **Create rule file** in appropriate directory
2. **Implement Rule interface**:

```typescript
interface Rule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warn' | 'off';
  category: 'slop' | 'security' | 'quality' | 'style' | 'localization';
  check: (file: File) => Diagnostic[];
}
```

3. **Register in `src/index.ts`**:

```typescript
export const rules: Rule[] = [
  noPlaceholderComments,
  noLazyNaming,
  noHallucinatedImports,
  // ... more rules
];
```

4. **Add tests** in `tests/rules/`:

```typescript
describe('no-placeholder-comments', () => {
  it('detects TODO without context', () => {
    const code = `// TODO: implement this`;
    const diagnostics = check(code);
    expect(diagnostics).toHaveLength(1);
  });
});
```

5. **Document in `docs/rules/`** – See [docs/rules/README.md](../docs/rules/README.md)

## Rule Categories

### Slop

AI-generated code patterns:
- Placeholder comments
- Lazy naming
- Hallucinated imports
- Copy-paste artifacts
- Boilerplate intros

### Security

Vulnerabilities and unsafe patterns:
- Hardcoded secrets
- Unsafe eval
- SQL injection
- XSS vulnerabilities
- Weak crypto

### Quality

Maintainability issues:
- Missing types
- Unsafe any
- Long functions
- High complexity
- Duplicate code

### Style

Consistency issues:
- var usage
- Console logging
- Debugger statements
- Arrow functions
- Trailing spaces

### Localization

Internationalization:
- Non-English text
- Missing i18n
- Mixed languages

## Testing Rules

Run rule tests:

```bash
pnpm test rules
```

Run specific rule test:

```bash
pnpm test no-placeholder-comments
```

## Performance

Rules have different performance characteristics:

| Type | Performance | Cost |
|------|-------------|------|
| Pattern (regex) | Fast | <0.1ms/file |
| AST traversal | Medium | 0.5-1ms/file |
| Cross-file analysis | Slow | 2-5ms/file |

See [BENCHMARKS.md](../BENCHMARKS.md) for detailed benchmarks.

## See Also

- [Rules Index](../docs/RULES.md) – Complete documentation
- [ARCHITECTURE.md](../ARCHITECTURE.md) – Technical deep dive
- [docs/rules/](../docs/rules/) – Individual rule docs
- [BENCHMARKS.md](../BENCHMARKS.md) – Performance data
