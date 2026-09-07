# Example Projects

This directory contains complete example projects demonstrating how to integrate Claude AntiSlop into different types of applications.

## Available Examples

### 🚀 [nextjs-app](./nextjs-app/)

Next.js application with AntiSlop integration.

**Features:**
- App router configuration
- TypeScript strict mode
- ESLint integration
- GitHub Actions CI
- Pre-commit hooks with Husky
- VS Code settings

**Best for:** React/Next.js applications, frontend projects

```bash
cd examples/nextjs-app
npm install
npm run lint:antislop
```

### 🌐 [express-api](./express-api/)

Express.js REST API with security-focused AntiSlop configuration.

**Features:**
- Security rules enabled (SQL injection, XSS, secrets)
- TypeScript strict mode
- Docker integration
- Environment variable management
- Comprehensive error handling
- GitHub Actions with PostgreSQL

**Best for:** Backend APIs, Node.js services, REST APIs

```bash
cd examples/express-api
npm install
npm run lint:antislop
```

### 📦 [monorepo](./monorepo/)

pnpm workspace monorepo with multiple packages.

**Features:**
- Root configuration with package overrides
- Turborepo integration
- Nx integration examples
- Shared config package
- Cross-package imports
- Cached CI pipelines

**Best for:** Large codebases, multiple apps, micro-frontends

```bash
cd examples/monorepo
pnpm install
pnpm lint:antislop
```

## Configuration Examples

### Strict Configuration

For production-critical code:

```bash
cp examples/strict/.antisloprc.json .antisloprc.json
```

**Characteristics:**
- All rules as errors
- Zero warnings allowed
- Security checks enabled
- Best for: Libraries, SDKs, critical infrastructure

### Relaxed Configuration

For rapid prototyping:

```bash
cp examples/relaxed/.antisloprc.json .antisloprc.json
```

**Characteristics:**
- Only critical errors
- Warnings allowed (up to threshold)
- Faster iteration
- Best for: MVPs, prototypes, personal projects

### Team Configuration

Balanced for team collaboration:

```bash
cp examples/team/.antisloprc.json .antisloprc.json
```

**Characteristics:**
- Mix of errors and warnings
- JSON output for CI
- Localization enabled
- Best for: Startups, enterprise teams

## Quick Integration Guide

### 1. Install AntiSlop

```bash
npm install -g claude-antislop
# or
pnpm add -g claude-antislop
```

### 2. Copy Configuration

```bash
# Choose based on your project type
cp examples/nextjs-app/.antisloprc.json .antisloprc.json
# or
cp examples/express-api/.antisloprc.json .antisloprc.json
# or
cp examples/monorepo/.antisloprc.json .antisloprc.json
```

### 3. Add to package.json

```json
{
  "scripts": {
    "lint:antislop": "claude-antislop check ./src"
  }
}
```

### 4. Run

```bash
npm run lint:antislop
```

### 5. Add to CI (Optional)

See example `.github/workflows/` in each example for GitHub Actions configuration.

## Learning Path

1. **Start simple:** Run AntiSlop on your existing project
2. **Review output:** Understand what rules are flagging
3. **Fix issues:** Address errors and warnings
4. **Tune config:** Adjust rules to your needs
5. **Add to CI:** Integrate into your pipeline
6. **Pre-commit hooks:** Prevent issues from being committed

## Common Patterns

### Frontend (Next.js, React, Vue)

```json
{
  "rules": {
    "no-console-log": "warn",
    "no-debugger": "error",
    "require-type-annotations": "error",
    "no-any-type": "error"
  },
  "exclude": [
    "**/*.test.tsx",
    "**/*.stories.tsx"
  ]
}
```

### Backend (Express, Fastify, NestJS)

```json
{
  "rules": {
    "no-console-log": "error",
    "no-hardcoded-secrets": "error",
    "no-sql-injection": "error",
    "no-xss-vulnerable": "error"
  },
  "security": {
    "checkSecrets": true,
    "checkUnsafePatterns": true
  }
}
```

### Monorepo (pnpm, Turborepo, Nx)

```json
// Root config
{
  "rules": {
    "no-placeholder-comments": "error",
    "no-lazy-naming": "warn"
  }
}

// Package override
{
  "extends": "../../.antisloprc.json",
  "rules": {
    "no-console-log": "error"
  }
}
```

## Troubleshooting

### Too many warnings

Start with relaxed config, gradually tighten:

```bash
cp examples/relaxed/.antisloprc.json .antisloprc.json
# Fix issues, then switch to strict
cp examples/strict/.antisloprc.json .antisloprc.json
```

### Slow performance

Use exclude patterns and incremental checks:

```json
{
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/generated/**"
  ]
}
```

```bash
# Check only changed files
claude-antislop check ./src --since origin/main
```

### False positives

Use inline disables or file overrides:

```typescript
// antislop-disable-next-line no-lazy-naming
const data = getData(); // Intentional
```

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-lazy-naming": "off"
      }
    }
  ]
}
```

## See Also

- [Usage Guide](../docs/USAGE.md) – Configuration reference
- [CLI Reference](../docs/CLI.md) – Command-line options
- [Rules Index](../docs/RULES.md) – All available rules
- [Recipes](../RECIPES.md) – Common workflows

## Contributing

Found an issue with an example? Want to add a new example project?

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for how to contribute.

## License

MIT
