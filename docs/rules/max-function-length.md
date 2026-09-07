# Rule: max-function-length

**Category:** Quality  
**Severity:** `warn` (default)  
**Performance:** Low (AST-based)

## Description

Detects functions that exceed a maximum number of lines, indicating potential complexity and maintainability issues.

## Why It Matters

Long functions are hard to maintain:
- **Cognitive load:** Too much logic in one place
- **Testing difficulty:** Hard to test all code paths
- **Reusability:** Logic is tangled, can't extract pieces
- **Debugging:** Hard to find and fix bugs
- **AI slop:** AI models often generate long, unfocused functions

Refactor long functions into smaller, focused units.

## Examples

### ❌ Bad

```typescript
// Function with 80+ lines
function processOrder(order: Order): Result {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Empty order');
  }
  
  // Calculate subtotal
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  
  // Apply discounts
  let discount = 0;
  if (order.couponCode) {
    const coupon = getCoupon(order.couponCode);
    if (coupon) {
      discount = coupon.calculateDiscount(subtotal);
    }
  }
  
  // Calculate tax
  const taxRate = getTaxRate(order.shippingAddress);
  const tax = (subtotal - discount) * taxRate;
  
  // Calculate shipping
  const shipping = calculateShipping(order.items, order.shippingAddress);
  
  // Calculate total
  const total = subtotal - discount + tax + shipping;
  
  // Create payment
  const payment = createPayment({
    amount: total,
    currency: order.currency,
    method: order.paymentMethod,
  });
  
  // Update inventory
  for (const item of order.items) {
    updateInventory(item.productId, item.quantity);
  }
  
  // Send confirmation
  sendConfirmationEmail(order.userEmail, {
    orderId: order.id,
    total,
    items: order.items,
  });
  
  // Create shipment
  const shipment = createShipment({
    orderId: order.id,
    address: order.shippingAddress,
    items: order.items,
  });
  
  // Log order
  logOrder({
    orderId: order.id,
    userId: order.userId,
    total,
    items: order.items.length,
  });
  
  return {
    success: true,
    orderId: order.id,
    total,
    paymentId: payment.id,
    shipmentId: shipment.id,
  };
}
```

### ✅ Good

```typescript
// Refactored into focused functions
function processOrder(order: Order): Result {
  validateOrder(order);
  
  const { subtotal, discount, tax, shipping, total } = calculateOrderTotals(order);
  const payment = createPaymentForOrder(order, total);
  updateInventoryForOrder(order);
  sendConfirmationForOrder(order, total);
  const shipment = createShipmentForOrder(order);
  logOrderProcessing(order, total);
  
  return {
    success: true,
    orderId: order.id,
    total,
    paymentId: payment.id,
    shipmentId: shipment.id,
  };
}

function calculateOrderTotals(order: Order): OrderTotals {
  const subtotal = calculateSubtotal(order.items);
  const discount = calculateDiscount(order, subtotal);
  const taxRate = getTaxRate(order.shippingAddress);
  const tax = (subtotal - discount) * taxRate;
  const shipping = calculateShipping(order.items, order.shippingAddress);
  const total = subtotal - discount + tax + shipping;
  
  return { subtotal, discount, tax, shipping, total };
}

function createPaymentForOrder(order: Order, total: number): Payment {
  return createPayment({
    amount: total,
    currency: order.currency,
    method: order.paymentMethod,
  });
}
```

## Configuration

### Basic

```json
{
  "rules": {
    "max-function-length": ["warn", { "max": 50 }]
  }
}
```

### With Options

```json
{
  "rules": {
    "max-function-length": [
      "warn",
      {
        "max": 50,
        "maxComments": 10,
        "maxBlankLines": 5,
        "ignoreEmptyLines": true,
        "ignoreComments": false,
        "allowTestFunctions": true
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max` | number | `50` | Maximum lines per function |
| `maxComments` | number | `0` | Maximum comment lines to allow |
| `maxBlankLines` | number | `0` | Maximum blank lines to allow |
| `ignoreEmptyLines` | boolean | `false` | Don't count empty lines |
| `ignoreComments` | boolean | `false` | Don't count comment lines |
| `allowTestFunctions` | boolean | `false` | Allow longer functions in test files |

## When to Disable

### Test Files

Test functions may be longer with fixtures:

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "max-function-length": "off"
      }
    }
  ]
}
```

### Generated Code

Code generators may produce long functions:

```json
{
  "overrides": [
    {
      "files": ["src/generated/**/*"],
      "rules": {
        "max-function-length": "off"
      }
    }
  ]
}
```

## Related Rules

- [`max-params`](max-params.md) – Too many parameters
- [`complexity`](complexity.md) – Cyclomatic complexity
- [`no-duplicate-code`](no-duplicate-code.md) – Duplicated logic

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [Clean Code: Functions](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29) – Function best practices
- [Refactoring: Extract Function](https://refactoring.com/catalog/extractFunction.html) – Refactoring technique
