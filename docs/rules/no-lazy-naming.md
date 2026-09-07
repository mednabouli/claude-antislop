# Rule: no-lazy-naming

**Category:** Slop  
**Severity:** `warn` (default)  
**Performance:** Low (pattern-based)

## Description

Detects generic, non-descriptive variable and function names that indicate lazy or AI-generated code.

## Why It Matters

Lazy naming is a hallmark of AI-generated code:
- `data`, `temp`, `obj`, `result` – Meaningless names
- `foo`, `bar`, `baz` – Placeholder names
- `item1`, `item2`, `data1`, `data2` – Numbered generics
- `handleClick`, `doSomething`, `processData` – Vague verbs

Good names document intent and reduce cognitive load.

## Examples

### ❌ Bad

```typescript
const data = getData();
const temp = calculateSomething(data);
const result = process(temp);

function doSomething(items: any[]) {
  const obj = {};
  const res = items.map(item => item.value);
  return res;
}

const data1 = getUsers();
const data2 = getPosts();
const data3 = getComments();
```

### ✅ Good

```typescript
const users = fetchUsers();
const total = calculateTotalWithTax(users);
const formattedUsers = formatUserList(users);

function extractUserEmails(users: User[]): string[] {
  const emailMap = new Map<string, string>();
  const emails = users.map(user => user.email);
  return emails;
}

const users = fetchUsers();
const posts = fetchPosts();
const comments = fetchComments();
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-lazy-naming": "warn"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-lazy-naming": [
      "warn",
      {
        "bannedNames": ["data", "temp", "obj", "result", "foo", "bar"],
        "allowShortLoops": true,
        "minNameLength": 3
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bannedNames` | string[] | `["data", "temp", "obj", "result", "foo", "bar", "baz"]` | Explicitly banned names |
| `allowShortLoops` | boolean | `true` | Allow `i`, `j`, `k` in for loops |
| `minNameLength` | number | `2` | Minimum name length |
| `requireSemanticNames` | boolean | `false` | Enforce names that describe purpose |

## Patterns Detected

### Generic Names

- `data`, `datum`, `info`
- `temp`, `tmp`, `temporary`
- `obj`, `object`, `item`
- `result`, `res`, `output`
- `value`, `val`, `v`

### Placeholder Names

- `foo`, `bar`, `baz`, `qux`
- `test`, `example`, `sample`

### Numbered Generics

- `data1`, `data2`, `data3`
- `item1`, `item2`, `item3`
- `user1`, `user2`, `user3`

### Vague Verbs

- `doSomething`, `doStuff`, `doIt`
- `handleThing`, `handleStuff`
- `processData`, `processItem`, `processThings`

## When to Disable

- **Loop iterators:** `i`, `j`, `k` are acceptable in short loops
- **Mathematical contexts:** `x`, `y`, `z`, `n` in formulas
- **Test fixtures:** `mockData`, `testUser` in tests

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

## Related Rules

- [`require-type-annotations`](require-type-annotations.md) – Type safety
- [`no-any-type`](no-any-type.md) – Unsafe types
- [`no-redundant-comments`](no-redundant-comments.md) – Comment quality

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Usage Guide](../USAGE.md) – Configuration guide
- [Clean Code: Naming](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29) – Naming best practices
