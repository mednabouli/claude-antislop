# Express API Example with Claude AntiSlop

This example shows how to integrate Claude AntiSlop into an Express.js API.

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
express-api/
├── src/
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # Route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Utilities
│   └── index.ts          # App entry point
├── tests/
│   ├── controllers/      # Controller tests
│   └── services/         # Service tests
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
    "no-copy-paste-artifacts": "error",
    "no-hardcoded-secrets": "error",
    "no-sql-injection": "error",
    "no-xss-vulnerable": "error",
    "require-type-annotations": "error",
    "no-any-type": "error",
    "no-console-log": "error",
    "no-debugger": "error"
  },
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/coverage/**",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  "include": [
    "src/**/*.{ts,tsx,js}"
  ],
  "output": "text",
  "failOnError": true,
  "colors": true,
  "security": {
    "checkSecrets": true,
    "checkUnsafePatterns": true
  }
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "lint:antislop": "claude-antislop check ./src",
    "lint:fix": "claude-antislop check ./src --fix",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

## Example Controller

```typescript
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.findById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json({ data: user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: Partial<User> = req.body;
      const user = await this.userService.create(userData);
      
      res.status(201).json({ data: user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: 'Invalid user data' });
    }
  }
}
```

## Security Rules for APIs

### Prevent SQL Injection

```typescript
// ❌ Bad - Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;

// ✅ Good - Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
const values = [req.params.id];
```

### Prevent XSS

```typescript
// ❌ Bad - XSS vulnerable
res.send(`<div>${userInput}</div>`);

// ✅ Good - Escaped output
import { escapeHtml } from '../utils/security';
res.send(`<div>${escapeHtml(userInput)}</div>`);
```

### No Hardcoded Secrets

```typescript
// ❌ Bad - Hardcoded secret
const JWT_SECRET = 'my-super-secret-key';

// ✅ Good - Environment variable
const JWT_SECRET = process.env.JWT_SECRET;
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
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run linter
        run: npm run lint
      
      - name: Install AntiSlop
        run: npm install -g claude-antislop
      
      - name: Run AntiSlop Check
        run: npm run lint:antislop
      
      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
```

## Pre-commit Hook

Using Husky:

```bash
# Install Husky
npm install -D husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint:antislop && npm run test"
```

## Docker Integration

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install AntiSlop globally
RUN npm install -g claude-antislop

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Run AntiSlop check during build
RUN claude-antislop check ./src --fail-on-error

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

## Environment Variables

Create `.env.example`:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Common Issues & Solutions

### Issue: Environment variables flagged as secrets

**Solution:** Exclude environment variable usage:

```json
{
  "rules": {
    "no-hardcoded-secrets": [
      "error",
      {
        "ignorePatterns": ["process.env"]
      }
    ]
  }
}
```

### Issue: Console.error in error handling

**Solution:** Allow console.error for error logging:

```json
{
  "rules": {
    "no-console-log": [
      "error",
      {
        "allow": ["error", "warn"]
      }
    ]
  }
}
```

### Issue: TypeScript any in third-party types

**Solution:** Allow any in type definitions:

```json
{
  "overrides": [
    {
      "files": ["src/types/**/*.ts"],
      "rules": {
        "no-any-type": "off"
      }
    }
  ]
}
```

## Best Practices

1. **Security first:** Enable all security rules for APIs
2. **Type safety:** Use strict TypeScript, no `any`
3. **Error handling:** Proper try-catch with logging
4. **Input validation:** Validate all user input
5. **Environment variables:** Never hardcode secrets
6. **Testing:** Write tests for all endpoints
7. **Documentation:** Document all API endpoints

## See Also

- [Express.js Documentation](https://expressjs.com/)
- [Claude AntiSlop Security Rules](../../docs/rules/SECURITY.md)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/intro.html)

## License

MIT
