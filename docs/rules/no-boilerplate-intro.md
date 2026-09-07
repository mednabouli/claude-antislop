# Rule: no-boilerplate-intro

**Category:** Slop  
**Severity:** `warn` (default)  
**Performance:** Low (pattern-based)

## Description

Detects generic, AI-style introductory comments that add no value.

## Why It Matters

Boilerplate comments are common in AI-generated code:
- **No information:** State the obvious ("This function does X")
- **Wasted space:** Adds lines without value
- **AI fingerprint:** Indicates AI-generated or template code
- **Noise:** Makes finding useful comments harder
- **Maintenance:** Must be updated when code changes

Comments should explain **why**, not **what**.

## Examples

### ❌ Bad

```typescript
// This function calculates the total
function calculateTotal(items: Item[]): number {
  // ... implementation
}

// This interface represents a user
interface User {
  id: string;
  name: string;
}

// Import necessary dependencies
import { formatDate } from './utils';
import { Logger } from './logger';

// This class is responsible for user management
class UserManager {
  // This method gets a user by ID
  getUser(id: string): User {
    // ... implementation
  }
}

// The following code handles authentication
function authenticate(user: User): boolean {
  // ... implementation
}
```

### ✅ Good

```typescript
// Calculate total with tax and discounts
function calculateTotal(items: Item[]): number {
  // ... implementation
}

// User entity for authentication
interface User {
  id: string;
  name: string;
}

// Format dates and log events
import { formatDate } from './utils';
import { Logger } from './logger';

// Manages user lifecycle and permissions
class UserManager {
  // Fetch user from database by ID
  getUser(id: string): User {
    // ... implementation
  }
}

// Validate credentials and create session
function authenticate(user: User): boolean {
  // ... implementation
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-boilerplate-intro": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-boilerplate-intro": [
      "warn",
      {
        "checkFunctionComments": true,
        "checkClassComments": true,
        "checkImportComments": true,
        "checkFileHeaders": true,
        "allowJSDoc": false,
        "bannedPatterns": [
          "^\\s*//\\s*(This function|This method|This class|This interface)",
          "^\\s*//\\s*(Import|Loading|Require)",
          "^\\s*//\\s*(The following code|This code)",
          "^\\s*//\\s*(Responsible for|Handles|Manages)"
        ]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkFunctionComments` | boolean | `true` | Check function/method comments |
| `checkClassComments` | boolean | `true` | Check class comments |
| `checkImportComments` | boolean | `true` | Check import statement comments |
| `checkFileHeaders` | boolean | `true` | Check file header comments |
| `allowJSDoc` | boolean | `false` | Allow JSDoc-style documentation |
| `bannedPatterns` | string[] | `[]` | Regex patterns to detect boilerplate |

## Patterns Detected

### Function/Method Comments

```typescript
// This function processes data
function process(data: Data) { /* ... */ }

// This method validates the input
validate(input) { /* ... */ }
```

### Class Comments

```typescript
// This class manages users
class UserManager { /* ... */ }

// This interface represents configuration
interface Config { /* ... */ }
```

### Import Comments

```typescript
// Import utilities
import { utils } from './utils';

// Load dependencies
const logger = require('./logger');
```

### File Headers

```typescript
// This file contains user-related functions
// Author: AI Assistant
// Created: 2024-01-01
```

## When to Disable

### JSDoc Documentation

Proper JSDoc is valuable:

```json
{
  "rules": {
    "no-boilerplate-intro": [
      "warn",
      {
        "allowJSDoc": true
      }
    ]
  }
}
```

```typescript
/**
 * Calculate order total with tax and discounts
 * @param items - Array of line items
 * @returns Total amount including tax
 * @throws Error if items is empty
 */
function calculateTotal(items: Item[]): number {
  // ... implementation
}
```

### Educational Code

Tutorials may use explanatory comments:

```json
{
  "overrides": [
    {
      "files": ["examples/**/*", "tutorials/**/*"],
      "rules": {
        "no-boilerplate-intro": "off"
      }
    }
  ]
}
```

## Related Rules

- [`no-placeholder-comments`](no-placeholder-comments.md) – Placeholder comments
- [`no-redundant-comments`](no-redundant-comments.md) – Obvious comments
- [`no-todo-comments`](no-todo-comments.md) – TODO comments

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Clean Code: Comments](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29) – Comment best practices
- [JSDoc Documentation](https://jsdoc.app/) – JSDoc guide
- [AI Code Detection](https://github.com/topics/ai-code-detection) – AI code patterns
