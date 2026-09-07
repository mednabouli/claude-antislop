# Monorepo Example with Claude AntiSlop

This example shows how to integrate Claude AntiSlop into a pnpm workspace monorepo.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run AntiSlop on all packages
pnpm -r lint:antislop

# Or run on specific package
pnpm --filter @myorg/api lint:antislop
```

## Project Structure

```
monorepo/
├── packages/
│   ├── api/              # Express API package
│   │   ├── src/
│   │   ├── .antisloprc.json
│   │   └── package.json
│   ├── web/              # Next.js web app
│   │   ├── src/
│   │   ├── .antisloprc.json
│   │   └── package.json
│   ├── shared/           # Shared types and utilities
│   │   ├── src/
│   │   ├── .antisloprc.json
│   │   └── package.json
│   └── cli/              # CLI tool
│       ├── src/
│       ├── .antisloprc.json
│       └── package.json
├── .antisloprc.json      # Root configuration
├── pnpm-workspace.yaml   # pnpm workspace definition
├── package.json          # Root package.json
└── README.md
```

## Root Configuration

### .antisloprc.json (Root)

```json
{
  "$schema": "https://raw.githubusercontent.com/mednabouli/claude-antislop/main/templates/schema.json",
  "rules": {
    "no-placeholder-comments": "error",
    "no-lazy-naming": "warn",
    "no-hallucinated-imports": "error",
    "no-copy-paste-artifacts": "error",
    "no-hardcoded-secrets": "error",
    "require-type-annotations": "error",
    "no-any-type": "error"
  },
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts"
  ],
  "output": "text",
  "failOnError": true,
  "colors": true
}
```

### Package-Specific Overrides

Each package can override root config:

```json
// packages/api/.antisloprc.json
{
  "extends": "../../.antisloprc.json",
  "rules": {
    "no-console-log": "error",
    "no-sql-injection": "error",
    "no-xss-vulnerable": "error"
  },
  "include": [
    "src/**/*.{ts,tsx}"
  ]
}

// packages/web/.antisloprc.json
{
  "extends": "../../.antisloprc.json",
  "rules": {
    "no-console-log": "warn",
    "react-no-dangerous-html": "error"
  },
  "include": [
    "src/**/*.{ts,tsx}"
  ]
}

// packages/shared/.antisloprc.json
{
  "extends": "../../.antisloprc.json",
  "rules": {
    "require-type-annotations": "error",
    "no-any-type": "error",
    "export-only-types": "error"
  }
}
```

## Package.json Scripts

### Root package.json

```json
{
  "name": "myorg-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r dev",
    "lint": "pnpm -r lint",
    "lint:antislop": "pnpm -r lint:antislop",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck"
  },
  "devDependencies": {
    "claude-antislop": "^1.0.0"
  }
}
```

### Package package.json

```json
// packages/api/package.json
{
  "name": "@myorg/api",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "lint": "eslint src --ext .ts",
    "lint:antislop": "claude-antislop check ./src",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@myorg/shared": "workspace:*",
    "express": "^4.18.0"
  }
}
```

## pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

## GitHub Actions Integration

Add to `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run AntiSlop (all packages)
        run: pnpm lint:antislop
      
      - name: Run type check
        run: pnpm typecheck
      
      - name: Run tests
        run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: lint
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build all packages
        run: pnpm build
```

## Turborepo Integration

If using Turborepo:

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "lint:antislop": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Run with Turborepo

```bash
# Run AntiSlop on all packages
turbo run lint:antislop

# Run with caching
turbo run lint:antislop --cache-dir=.turbo

# Run on specific package
turbo run lint:antislop --filter=@myorg/api
```

## Nx Integration

If using Nx:

### nx.json

```json
{
  "targetDefaults": {
    "lint:antislop": {
      "cache": true,
      "inputs": ["default", "^default"]
    }
  }
}
```

### Run with Nx

```bash
# Run AntiSlop on all packages
nx run-many --target=lint:antislop

# Run on specific package
nx run @myorg/api:lint:antislop

# Affected packages only
nx affected --target=lint:antislop
```

## Shared Configuration Package

Create a shared config package:

```
packages/
└── config/
    ├── antisloprc/       # Shared AntiSlop configs
    │   ├── base.json
    │   ├── api.json
    │   └── web.json
    └── package.json
```

### packages/config/antisloprc/base.json

```json
{
  "$schema": "https://raw.githubusercontent.com/mednabouli/claude-antislop/main/templates/schema.json",
  "rules": {
    "no-placeholder-comments": "error",
    "no-lazy-naming": "warn",
    "no-hallucinated-imports": "error",
    "require-type-annotations": "error",
    "no-any-type": "error"
  },
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.test.ts"
  ]
}
```

### Usage in packages

```json
// packages/api/.antisloprc.json
{
  "extends": "@myorg/config/antisloprc/base.json",
  "rules": {
    "no-console-log": "error",
    "no-sql-injection": "error"
  }
}
```

## Pre-commit Hooks

Using Husky in monorepo:

```bash
# Install Husky at root
pnpm add -D husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm lint:antislop"
```

Or use lint-staged for staged files only:

```json
// Root package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "claude-antislop check --files"
    ]
  }
}
```

## Common Issues & Solutions

### Issue: Different rules per package

**Solution:** Use package-specific overrides:

```json
// packages/api/.antisloprc.json
{
  "extends": "../../.antisloprc.json",
  "rules": {
    "no-console-log": "error",
    "no-sql-injection": "error"
  }
}

// packages/web/.antisloprc.json
{
  "extends": "../../.antisloprc.json",
  "rules": {
    "no-console-log": "warn",
    "react-no-dangerous-html": "error"
  }
}
```

### Issue: Slow performance on large monorepo

**Solution:** Use caching and affected packages:

```bash
# With Turborepo
turbo run lint:antislop --cache-dir=.turbo

# With Nx
nx affected --target=lint:antislop

# Only check changed packages
pnpm --filter="...[origin/main]" lint:antislop
```

### Issue: Cross-package imports

**Solution:** Ensure shared package exports are typed:

```typescript
// packages/shared/src/index.ts
export * from './types';
export * from './utils';

// Packages importing shared
import { User, ApiResponse } from '@myorg/shared';
```

## Best Practices

1. **Root config:** Define base rules at root level
2. **Package overrides:** Allow packages to customize as needed
3. **Shared config:** Extract common configs to shared package
4. **Caching:** Use Turborepo or Nx for faster CI
5. **Affected checks:** Only check changed packages in PRs
6. **Consistent tooling:** Same linter, formatter, AntiSlop version
7. **Workspace protocols:** Use `workspace:*` for internal deps

## See Also

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo)
- [Nx Documentation](https://nx.dev)
- [Claude AntiSlop Usage Guide](../../docs/USAGE.md)

## License

MIT
