# Clean Code Standards

## Naming

### Use Descriptive Names

```javascript
// Bad
const d = 10;
function proc(data) { ... }

// Good
const daysUntilExpiry = 10;
function processUserData(userData) { ... }
```

### Use Pronounceable Names

```javascript
// Bad
const genymmdts = { ... };

// Good
const generationTimestamps = { ... };
```

### Use Searchable Names

```javascript
// Bad
const maxUsers = 100;
if (users.length === 100) { ... }

// Good
const MAX_USERS = 100;
if (users.length === MAX_USERS) { ... }
```

## Functions

### Small Functions

```javascript
// Bad
function processUser(user) {
  // 50 lines of code doing multiple things
  validate(user);
  save(user);
  sendEmail(user);
  log(user);
  // ...
}

// Good
function processUser(user) {
  validateUser(user);
  saveUser(user);
  sendWelcomeEmail(user);
  logUserCreation(user);
}
```

### Single Responsibility

```javascript
// Bad
function handleUserAndSendEmailAndLog(user) {
  // Does everything
}

// Good
function handleUser(user) {
  createUser(user);
  sendEmail(user);
  logAction(user);
}
```

### Function Arguments

```javascript
// Bad (too many arguments)
function createUser(name, email, age, address, phone, city, state, zip) {
  // ...
}

// Good (use object)
function createUser(userData) {
  const { name, email, age, address } = userData;
  // ...
}
```

## Comments

### Use Comments Wisely

```javascript
// Bad (obvious comment)
// Increment counter
counter++;

// Good (explains why)
// Retry up to 3 times for transient network errors
const MAX_RETRIES = 3;
```

### Document Intent

```javascript
// Bad
function check(u) {
  return u.a && u.a > 18;
}

// Good
function isAdult(user) {
  // Check if user is at least 18 years old
  return user.age && user.age > 18;
}
```

## Error Handling

### Try-Catch-Finally

```javascript
// Bad
try {
  riskyOperation();
} catch (e) {
  console.log(e);
}

// Good
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new OperationError('Failed to complete operation', error);
} finally {
  cleanup();
}
```

### Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
```

## Testing

### Write Testable Code

```javascript
// Hard to test
function getUser(id) {
  return database.query(`SELECT * FROM users WHERE id = ${id}`);
}

// Easy to test
async function getUser(id, db = database) {
  return db.query('SELECT * FROM users WHERE id = ?', [id]);
}
```

### Test Structure

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
    });
    
    it('should throw error for invalid email', async () => {
      // Arrange
      const invalidData = { name: 'John', email: 'invalid' };
      
      // Act & Assert
      await expect(userService.createUser(invalidData))
        .rejects
        .toThrow(ValidationError);
    });
  });
});
```

## Code Organization

### Group Related Code

```javascript
// Constants
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

// Utilities
function retry(fn, retries = MAX_RETRIES) { ... }
function timeout(ms) { ... }

// Main logic
async function fetchData() { ... }

// Exports
export { fetchData, retry, timeout };
```

## Principles

### DRY (Don't Repeat Yourself)

```javascript
// Bad
const price1 = quantity * 10;
const price2 = quantity * 10;
const price3 = quantity * 10;

// Good
const UNIT_PRICE = 10;
const price1 = quantity * UNIT_PRICE;
const price2 = quantity * UNIT_PRICE;
const price3 = quantity * UNIT_PRICE;
```

### KISS (Keep It Simple, Stupid)

```javascript
// Bad (over-engineered)
class DataProcessorFactoryBuilder {
  // 100 lines of complex code
}

// Good (simple)
function processData(data) {
  return data.map(transform).filter(valid);
}
```

### YAGNI (You Ain't Gonna Need It)

```javascript
// Bad (premature optimization)
class OptimizedCacheWithMultipleStrategiesAndFallbacks {
  // Complex code for hypothetical future use
}

// Good (implement when needed)
const cache = new Map();
```

## Tips

- Write code for humans, not just computers
- Refactor continuously
- Read code more than you write it
- Follow team conventions
- Keep learning and improving
