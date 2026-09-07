# Next.js Example with Claude AntiSlop

This example shows how to integrate Claude AntiSlop into a Next.js application.

## Quick Start

```bash
# Install dependencies
npm install

# Run AntiSlop check
npx claude-antislop check ./src

# Or use npm script
npm run lint:antislop
```

## Project Structure

```
nextjs-app/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   └── pages/            # Next.js pages (if using pages router)
├── .antisloprc.json      # AntiSlop configuration
├── package.json
└── README.md
```

## Configuration

### .antisloprc.json

```json
{
  "$schema": "https://raw.githubusercontent.com/mednabouli/claude-antislop/main/templates/schema.json",
  "rules": {
    "no-placeholder-comments": "error",
    "no-lazy-naming": "warn",
    "no-hallucinated-imports": "error",
    "no-copy-paste-artifacts": "warn",
    "require-type-annotations": "error",
    "no-any-type": "error",
    "no-console-log": "warn",
    "no-debugger": "error"
  },
  "exclude": [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/build/**",
    "**/*.test.tsx",
    "**/*.spec.ts"
  ],
  "include": [
    "src/**/*.{ts,tsx}"
  ],
  "output": "text",
  "failOnError": true,
  "colors": true
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:antislop": "claude-antislop check ./src",
    "lint:fix": "claude-antislop check ./src --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

## GitHub Actions Integration

Add to `.github/workflows/lint.yml`:

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
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install AntiSlop
        run: npm install -g claude-antislop
      
      - name: Run AntiSlop Check
        run: npm run lint:antislop
```

## VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

Install the [Claude AntiSlop VS Code extension](https://marketplace.visualstudio.com/items?itemName=mednabouli.claude-antislop) for inline warnings.

## Pre-commit Hook

Using Husky:

```bash
# Install Husky
npm install -D husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint:antislop"
```

## Example Component

```typescript
// src/components/UserCard.tsx
import { User } from '@/types/user';

interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>
          Edit
        </button>
      )}
    </div>
  );
}
```

## Common Issues & Solutions

### Issue: False positives in generated code

**Solution:** Exclude generated directories:

```json
{
  "exclude": [
    "**/.next/**",
    "**/generated/**",
    "**/*.gen.ts"
  ]
}
```

### Issue: Too many warnings in tests

**Solution:** Relax rules for test files:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.tsx", "**/*.spec.ts"],
      "rules": {
        "no-console-log": "off",
        "no-any-type": "off"
      }
    }
  ]
}
```

### Issue: Slow performance on large codebase

**Solution:** Use incremental checks in CI:

```yaml
- name: Run AntiSlop (incremental)
  run: npx claude-antislop check ./src --since origin/main
```

## Best Practices

1. **Start with warnings:** Begin with `"warn"` severity, upgrade to `"error"` gradually
2. **Exclude strategically:** Don't check generated code or third-party directories
3. **Use in CI:** Catch issues before they reach main
4. **Pre-commit hooks:** Prevent bad code from being committed
5. **VS Code extension:** Get feedback as you code

## See Also

- [Next.js Documentation](https://nextjs.org/docs)
- [Claude AntiSlop Usage Guide](../../docs/USAGE.md)
- [CLI Reference](../../docs/CLI.md)
- [GitHub Actions Guide](../../docs/GITHUB_ACTION.md)

## License

MIT
