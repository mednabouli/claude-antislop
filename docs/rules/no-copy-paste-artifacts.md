# Rule: no-copy-paste-artifacts

**Category:** Slop  
**Severity:** `error` (default)  
**Performance:** Medium (similarity detection)

## Description

Detects copy-pasted code blocks and artifacts from AI generation or code duplication.

## Why It Matters

Copy-pasted code indicates:
- **AI generation:** Models often repeat similar patterns
- **Poor abstraction:** Logic should be extracted to functions
- **Maintenance burden:** Changes needed in multiple places
- **Inconsistency:** Copies drift apart over time
- **Code bloat:** Unnecessary repetition increases size

DRY (Don't Repeat Yourself) is a fundamental software principle.

## Examples

### ❌ Bad

```typescript
// Duplicate blocks in same file
function processUser(user: User) {
  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
  return JSON.stringify(data);
}

function processAdmin(admin: Admin) {
  const data = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    createdAt: admin.createdAt.toISOString(),
  };
  return JSON.stringify(data);
}

// Leftover TODO from copy-paste
// TODO: Implement user validation (copied from auth.ts)
function createUser(data: UserData) {
  // ... implementation
}

// Comment artifacts
// This function calculates the total for orders
// Originally from order-service.js
function calculateUserTotal(user: User) {
  // ...
}
```

### ✅ Good

```typescript
// Extracted to shared function
function serializeEntity(entity: {id: string; name: string; email: string; createdAt: Date}) {
  const data = {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    createdAt: entity.createdAt.toISOString(),
  };
  return JSON.stringify(data);
}

function processUser(user: User) {
  return serializeEntity(user);
}

function processAdmin(admin: Admin) {
  return serializeEntity(admin);
}

// Clean comments
// Serialize user data for API response
function createUser(data: UserData) {
  // ... implementation
}

// Original, focused function
function calculateUserTotal(user: User) {
  // Calculate total based on user's items
  // ...
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-copy-paste-artifacts": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-copy-paste-artifacts": [
      "error",
      {
        "minLines": 5,
        "minSimilarity": 0.8,
        "checkComments": true,
        "checkCode": true,
        "allowBoilerplate": true,
        "excludePatterns": ["**/*.test.ts", "**/generated/**"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLines` | number | `5` | Minimum lines to consider as copy-paste |
| `minSimilarity` | number | `0.8` | Similarity threshold (0-1) |
| `checkComments` | boolean | `true` | Check comments for copy-paste artifacts |
| `checkCode` | boolean | `true` | Check code blocks for duplication |
| `allowBoilerplate` | boolean | `true` | Allow common boilerplate patterns |
| `excludePatterns` | string[] | `[]` | Files to exclude (tests, generated) |

## Patterns Detected

### Comment Artifacts

```typescript
// Copied from another file
// Originally from user-service.ts
// TODO: Fix this (from old code)
// Author: John Doe (from different project)
```

### Code Duplication

```typescript
// Same logic in multiple functions
const result1 = items.filter(x => x.active).map(x => x.value);
const result2 = items.filter(x => x.active).map(x => x.value);

// Nearly identical functions
function processA(data: Data) {
  const result = transform(data);
  return validate(result);
}

function processB(data: Data) {
  const result = transform(data);
  return validate(result);
}
```

### AI Generation Artifacts

```typescript
// Generic comments from AI
// This function is responsible for processing data
// The following code implements the required functionality
// Import necessary dependencies
```

## When to Disable

### Test Files

Tests often have repetitive fixtures:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-copy-paste-artifacts": "off"
      }
    }
  ]
}
```

### Generated Code

Code generators produce intentional duplicates:

```json
{
  "overrides": [
    {
      "files": ["src/generated/**/*"],
      "rules": {
        "no-copy-paste-artifacts": "off"
      }
    }
  ]
}
```

### Intentional Duplication

Sometimes duplication is better than wrong abstraction:

```typescript
// Different contexts, similar code is OK
function handleUserClick() { /* ... */ }
function handleButtonClick() { /* ... */ }
```

## Related Rules

- [`no-duplicate-code`](no-duplicate-code.md) – Duplicate detection
- [`max-function-length`](max-function-length.md) – Long functions
- [`no-placeholder-comments`](no-placeholder-comments.md) – Placeholder comments

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) – Software engineering principle
- [Refactoring: Extract Function](https://refactoring.com/catalog/extractFunction.html) – Refactoring technique
- [Code duplication detection](https://en.wikipedia.org/wiki/Copy-and-paste_programming) – Wikipedia
