# Recipes

Common workflows and integration patterns for Claude AntiSlop.

## Table of Contents

- [CI/CD Integration](#cicd-integration)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Monorepo Setup](#monorepo-setup)
- [Custom Rules](#custom-rules)
- [Migration Guides](#migration-guides)
- [Performance Tuning](#performance-tuning)

---

## CI/CD Integration

### GitHub Actions

Add to your workflow file (`.github/workflows/lint.yml`):

```yaml
name: Code Quality

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  antislop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install AntiSlop
        run: npm install -g claude-antislop
      
      - name: Run AntiSlop Check
        run: claude-antislop check ./src --output json --fail-on-error
```

### GitLab CI

```yaml
stages:
  - quality

antislop:
  stage: quality
  image: node:20
  script:
    - npm install -g claude-antislop
    - claude-antislop check ./src
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

### CircleCI

```yaml
version: 2.1

jobs:
  check-quality:
    docker:
      - image: node:20
    steps:
      - checkout
      - run:
          name: Install AntiSlop
          command: npm install -g claude-antislop
      - run:
          name: Run AntiSlop
          command: claude-antislop check ./src

workflows:
  quality-check:
    jobs:
      - check-quality
```

---

## Pre-commit Hooks

### Using Husky

1. Install Husky:

```bash
npm install -D husky
npx husky install
```

2. Add pre-commit hook:

```bash
npx husky add .husky/pre-commit "npx --no -- claude-antislop check ./src"
```

3. Commit the hook:

```bash
git add .husky/pre-commit
git commit -m "Add pre-commit hook"
```

### Using lint-staged

For staged files only:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "claude-antislop check --files"
    ]
  }
}
```

---

## Monorepo Setup

### pnpm Workspaces

Root `.antisloprc.json`:

```json
{
  "rules": {
    "no-placeholder-comments": "error",
    "no-hallucinated-imports": "error"
  },
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**"
  ]
}
```

Package-specific overrides in `packages/*/ .antisloprc.json`:

```json
{
  "extends": "../../.antisloprc.json",
  "rules": {
    "no-console-log": "error"
  },
  "include": [
    "src/**/*.{ts,tsx}"
  ]
}
```

Run on all packages:

```bash
pnpm -r exec claude-antislop check ./src
```

### Turborepo

In `turbo.json`:

```json
{
  "pipeline": {
    "check": {
      "outputs": []
    }
  }
}
```

Run:

```bash
npx turbo check
```

---

## Custom Rules

### Pattern-Based Rule

Create `rules/custom/my-rule.ts`:

```typescript
import { Rule, Diagnostic, File } from 'claude-antislop';

export const myRule: Rule = {
  id: 'my-custom-rule',
  name: 'My Custom Rule',
  description: 'Detects specific patterns',
  severity: 'warn',
  category: 'slop',
  check: (file: File): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    const pattern = /TODO: implement this properly/g;
    
    const lines = file.content.split('\n');
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        diagnostics.push({
          rule: 'my-custom-rule',
          severity: 'warn',
          message: 'Found placeholder TODO',
          line: index + 1,
          column: line.search(pattern) + 1,
        });
      }
    });
    
    return diagnostics;
  },
};
```

Register in your config:

```json
{
  "customRules": [
    "./rules/custom/my-rule.ts"
  ]
}
```

---

## Migration Guides

### From ESLint

1. Install AntiSlop alongside ESLint:

```bash
npm install -g claude-antislop
```

2. Create `.antisloprc.json` based on your ESLint config:

```json
{
  "rules": {
    "no-placeholder-comments": "error",
    "no-todo-comments": "warn",
    "no-console-log": "warn"
  }
}
```

3. Run both in parallel:

```bash
eslint . && claude-antislop check ./src
```

4. Gradually migrate rules to AntiSlop

### From Prettier

AntiSlop complements Prettier (formatting vs. quality):

```json
{
  "scripts": {
    "format": "prettier --write .",
    "check": "claude-antislop check ./src",
    "lint": "npm run format && npm run check"
  }
}
```

---

## Performance Tuning

### Large Codebases

For repos with 10k+ files:

```json
{
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/*.test.ts",
    "**/vendor/**",
    "**/generated/**",
    "**/*.min.js",
    "**/coverage/**"
  ],
  "include": [
    "src/**/*.{ts,tsx}"
  ],
  "parallel": true,
  "maxWorkers": 4
}
```

### CI Optimization

Cache node_modules and only check changed files:

```yaml
- name: Run AntiSlop
  run: claude-antislop check ./src --since origin/main
```

### Watch Mode

For local development:

```bash
claude-antislop watch ./src --interval 1000
```

---

## Advanced Patterns

### Conditional Rules by Path

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

### JSON Output for Dashboards

```bash
claude-antislop check ./src --output json > report.json
```

Parse with:

```javascript
const report = JSON.parse(fs.readFileSync('report.json', 'utf8'));
console.log(`Found ${report.errors} errors, ${report.warnings} warnings`);
```

### Git Hooks with Stash

For dirty working directories:

```bash
#!/bin/bash
# .husky/pre-commit
git stash push -m "WIP: pre-commit stash"
npx claude-antislop check ./src
exit_code=$?
git stash pop
exit $exit_code
```

---

## Troubleshooting

### Slow Performance

- Check exclude patterns are comprehensive
- Reduce maxWorkers if CPU-bound
- Use `--verbose` to identify slow files

### False Positives

- Add file-specific overrides
- Use inline comments to disable rules:
  ```typescript
  // antislop-disable-next-line no-lazy-naming
  const data1 = getData();
  ```

### Integration Issues

- Verify Node.js version (20+)
- Clear node_modules and reinstall
- Check config file location and syntax

---

## Community Recipes

Share your own recipes by submitting a PR to this file!

### Example: Next.js Project

```json
{
  "rules": {
    "no-placeholder-comments": "error",
    "no-console-log": "warn"
  },
  "exclude": [
    "**/.next/**",
    "**/node_modules/**",
    "**/public/**"
  ],
  "include": [
    "src/**/*.{ts,tsx}"
  ]
}
```

### Example: Express API

```json
{
  "rules": {
    "no-placeholder-comments": "error",
    "no-console-log": "error",
    "no-any-type": "error"
  },
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.test.ts"
  ]
}
```

---

Need help? Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) or open an issue.
