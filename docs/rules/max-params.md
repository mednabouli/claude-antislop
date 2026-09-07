# Rule: max-params

**Category:** Quality  
**Severity:** `warn` (default)  
**Performance:** Low (AST-based)

## Description

Detects functions with too many parameters, indicating potential design issues.

## Why It Matters

Functions with many parameters are problematic:
- **Hard to understand:** Too many inputs to track
- **Difficult to test:** Many combinations to cover
- **Refactoring resistance:** Changes affect all callers
- **Poor cohesion:** Likely doing too much
- **AI slop:** AI models often generate long parameter lists

Refactor to use configuration objects or builder patterns.

## Examples

### ❌ Bad

```typescript
// Too many parameters
function createUser(
  name: string,
  email: string,
  password: string,
  age: number,
  role: string,
  department: string,
  manager: string,
  startDate: Date,
  salary: number,
  bonus: number
): User {
  // ... implementation
}

// Constructor with many params
class Config {
  constructor(
    public host: string,
    public port: number,
    public username: string,
    public password: string,
    public database: string,
    public poolSize: number,
    public timeout: number
  ) {}
}
```

### ✅ Good

```typescript
// Configuration object
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  age?: number;
  role?: string;
  department?: string;
  manager?: string;
  startDate?: Date;
  salary?: number;
  bonus?: number;
}

function createUser(params: CreateUserParams): User {
  const {
    name,
    email,
    password,
    age = 0,
    role = 'user',
    // ...
  } = params;
  // ... implementation
}

// Builder pattern
class ConfigBuilder {
  private config: Config = new Config();
  
  setHost(host: string): this {
    this.config.host = host;
    return this;
  }
  
  setPort(port: number): this {
    this.config.port = port;
    return this;
  }
  
  build(): Config {
    return this.config;
  }
}

// Object configuration
const config = new Config({
  host: 'localhost',
  port: 5432,
  username: 'admin',
  // ...
});
```

## Configuration

### Basic

```json
{
  "rules": {
    "max-params": ["warn", { "max": 3 }]
  }
}
```

### With Options

```json
{
  "rules": {
    "max-params": [
      "warn",
      {
        "max": 3,
        "ignoreConstructors": false,
        "ignoreRestParams": true,
        "allowInTests": false
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | number | `3` | Maximum number of parameters allowed |
| `ignoreConstructors` | boolean | `false` | Allow more parameters in constructors |
| `ignoreRestParams` | boolean | `true` | Don't count rest parameters (`...args`) |
| `allowInTests` | boolean | `false` | Allow more parameters in test files |

## When to Disable

### Constructors

Some constructors legitimately need many params:

```json
{
  "rules": {
    "max-params": [
      "warn",
      {
        "max": 3,
        "ignoreConstructors": true
      }
    ]
  }
}
```

### Test Files

Test fixtures may need many parameters:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "max-params": "off"
      }
    }
  ]
}
```

## Related Rules

- [`max-function-length`](max-function-length.md) – Long functions
- [`complexity`](complexity.md) – Cyclomatic complexity
- [`require-type-annotations`](require-type-annotations.md) – Type safety

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Clean Code: Functions](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29) – Function best practices
- [Refactoring: Replace Parameter with Object](https://refactoring.com/catalog/replaceParameterWithObject.html) – Refactoring technique
- [ESLint: max-params](https://eslint.org/docs/rules/max-params) – ESLint rule
