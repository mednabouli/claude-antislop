# Rule: complexity

**Category:** Quality  
**Severity:** `warn` (default)  
**Performance:** Medium (AST analysis)

## Description

Detects functions with high cyclomatic complexity, indicating overly complex logic.

## Why It Matters

High complexity indicates:
- **Hard to test:** Many code paths to cover
- **Difficult to understand:** Logic is tangled
- **Bug-prone:** More places for bugs to hide
- **Hard to maintain:** Changes have unpredictable effects
- **AI slop:** AI models often generate complex nested logic

Refactor complex functions into smaller, focused units.

## Examples

### ❌ Bad

```typescript
// High complexity (complexity = 12)
function processOrder(order: Order): Result {
  if (order.status === 'pending') {
    if (order.items.length > 0) {
      for (const item of order.items) {
        if (item.inStock) {
          if (item.quantity > 0) {
            // ... nested logic
          }
        } else if (item.backorderAllowed) {
          // ... more logic
        }
      }
    } else if (order.allowEmpty) {
      // ... even more logic
    }
  } else if (order.status === 'cancelled') {
    // ... more branches
  }
  
  return result;
}
```

### ✅ Good

```typescript
// Refactored into focused functions (each complexity < 5)
function processOrder(order: Order): Result {
  if (!isValidOrder(order)) {
    return { success: false, error: 'Invalid order' };
  }
  
  const items = filterValidItems(order.items);
  const total = calculateTotal(items, order.coupon);
  const payment = processPayment(order, total);
  
  return {
    success: true,
    orderId: order.id,
    total,
    paymentId: payment.id,
  };
}

function isValidOrder(order: Order): boolean {
  return order.status === 'pending' && order.items.length > 0;
}

function filterValidItems(items: Item[]): Item[] {
  return items.filter(item => item.inStock && item.quantity > 0);
}

function calculateTotal(items: Item[], coupon?: Coupon): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return coupon ? applyDiscount(subtotal, coupon) : subtotal;
}

function processPayment(order: Order, total: number): Payment {
  // ... payment logic
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "complexity": ["warn", { "max": 10 }]
  }
}
```

### With Options

```json
{
  "rules": {
    "complexity": [
      "warn",
      {
        "max": 10,
        "ignoreGuardClauses": true,
        "ignoreLogicalOperators": false,
        "allowInTests": false
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | number | `10` | Maximum cyclomatic complexity allowed |
| `ignoreGuardClauses` | boolean | `false` | Don't count early returns (guard clauses) |
| `ignoreLogicalOperators` | boolean | `false` | Don't count && and || operators |
| `allowInTests` | boolean | `false` | Allow higher complexity in test files |

## Complexity Calculation

Cyclomatic complexity counts:
- **1** for the function itself
- **+1** for each `if`, `else if`, `else`
- **+1** for each `for`, `while`, `do-while`
- **+1** for each `case` in switch
- **+1** for each `catch` block
- **+1** for each `&&`, `||` (optional)
- **+1** for ternary operators (`?:`)

### Complexity Levels

| Complexity | Rating | Description |
|------------|--------|-------------|
| 1-5 | Low | Simple, easy to understand |
| 6-10 | Moderate | Manageable, consider refactoring |
| 11-20 | High | Difficult, should refactor |
| 21+ | Very High | Very difficult, must refactor |

## When to Disable

### Complex Algorithms

Some algorithms are inherently complex:

```json
{
  "overrides": [
    {
      "files": ["src/algorithms/**/*"],
      "rules": {
        "complexity": [
          "warn",
          {
            "max": 20
          }
        ]
      }
    }
  ]
}
```

### Test Files

Tests may have complex setup:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "complexity": "off"
      }
    }
  ]
}
```

## Refactoring Strategies

### Extract Function

```typescript
// Before (complexity = 15)
function process(data: Data) {
  if (condition1) {
    // 20 lines of logic
  }
  if (condition2) {
    // 30 lines of logic
  }
}

// After (complexity = 5 each)
function process(data: Data) {
  if (condition1) {
    handleCondition1(data);
  }
  if (condition2) {
    handleCondition2(data);
  }
}
```

### Guard Clauses

```typescript
// Before (nested, high complexity)
function process(user: User) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        // actual logic
      }
    }
  }
}

// After (flat, lower complexity)
function process(user: User) {
  if (!user) return;
  if (!user.active) return;
  if (!user.verified) return;
  
  // actual logic
}
```

### Early Returns

```typescript
// Before (deep nesting)
function calculate(order: Order) {
  if (order) {
    if (order.items) {
      // calculation
    }
  }
}

// After (early returns)
function calculate(order: Order) {
  if (!order) return 0;
  if (!order.items) return 0;
  
  // calculation
}
```

## Related Rules

- [`max-function-length`](max-function-length.md) – Long functions
- [`max-params`](max-params.md) – Too many parameters
- [`no-duplicate-code`](no-duplicate-code.md) – Duplicated logic

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) – Wikipedia
- [Refactoring: Extract Function](https://refactoring.com/catalog/extractFunction.html) – Refactoring technique
- [ESLint: complexity](https://eslint.org/docs/rules/complexity) – ESLint rule
