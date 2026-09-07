# Rule: no-sql-injection

**Category:** Security  
**Severity:** `error` (default)  
**Performance:** Medium (AST + pattern analysis)

## Description

Detects SQL queries constructed with string concatenation or interpolation, which are vulnerable to SQL injection attacks.

## Why It Matters

SQL injection is one of the most critical web vulnerabilities:
- **Data theft:** Attackers can extract entire databases
- **Data modification:** Insert, update, or delete records
- **Authentication bypass:** Login as any user without password
- **Remote code execution:** Some databases allow OS command execution
- **Compliance violations:** PCI DSS, HIPAA, GDPR require protection

Always use parameterized queries or query builders.

## Examples

### ❌ Bad

```typescript
// String concatenation
const query = "SELECT * FROM users WHERE id = " + userId;
const sql = "SELECT * FROM users WHERE email = '" + email + "'";

// Template literals
const query = `SELECT * FROM users WHERE id = ${userId}`;
const sql = `DELETE FROM orders WHERE id = ${orderId}`;

// User input directly
const query = `SELECT * FROM products WHERE name = '${req.query.name}'`;
const sql = "SELECT * FROM users WHERE password = '" + req.body.password + "'";

// Complex queries
const query = `SELECT * FROM users WHERE status = '${status}' AND role = '${role}'`;
```

### ✅ Good

```typescript
// Parameterized queries (PostgreSQL)
const query = 'SELECT * FROM users WHERE id = $1';
const values = [userId];

// Parameterized queries (MySQL)
const query = 'SELECT * FROM users WHERE email = ?';
const values = [email];

// Query builders
const query = knex('users').where('id', userId);
const result = await db('users').where({ id: userId });

// ORMs (Prisma)
const user = await prisma.user.findUnique({ where: { id: userId } });

// ORMs (TypeORM)
const user = await userRepository.findOne({ where: { id: userId } });

// Prepared statements
const stmt = await db.prepare('SELECT * FROM users WHERE id = ?');
const result = await stmt.get(userId);
```

## Configuration

### Basic

```json
{
  "rules": {
    "no-sql-injection": "error"
  }
}
```

### With Options

```json
{
  "rules": {
    "no-sql-injection": [
      "error",
      {
        "allowSafePatterns": true,
        "checkTemplateLiterals": true,
        "checkConcatenation": true,
        "allowedMethods": ["where", "findOne", "findUnique"]
      }
    ]
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowSafePatterns` | boolean | `false` | Allow queries with only numeric literals (not recommended) |
| `checkTemplateLiterals` | boolean | `true` | Check template literal interpolation |
| `checkConcatenation` | boolean | `true` | Check string concatenation |
| `allowedMethods` | string[] | `[]` | ORM/query builder methods to allow |

## Patterns Detected

### SELECT queries

```typescript
`SELECT * FROM users WHERE id = ${id}`
"SELECT * FROM users WHERE email = '" + email + "'"
```

### INSERT/UPDATE

```typescript
`INSERT INTO users (name, email) VALUES ('${name}', '${email}')`
`UPDATE users SET name = '${name}' WHERE id = ${id}`
```

### DELETE

```typescript
`DELETE FROM orders WHERE id = ${orderId}`
"DELETE FROM users WHERE email = '" + email + "'"
```

### WHERE clauses

```typescript
`WHERE status = '${status}' AND role = '${role}'`
`WHERE id IN (${ids.join(',')})`
```

### LIKE clauses

```typescript
`WHERE name LIKE '%${search}%'`
`WHERE email LIKE '${email}'`
```

## When to Disable

- **Static queries:** Queries with no variables (but this shouldn't trigger the rule)
- **Query builders:** When using safe ORM methods (configure `allowedMethods`)
- **Test files:** Mock queries in tests

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "no-sql-injection": "off"
      }
    }
  ]
}
```

## Safe Patterns

### Parameterized Queries

```typescript
// PostgreSQL
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND status = $2',
  [email, status]
);

// MySQL
const [rows] = await connection.execute(
  'SELECT * FROM users WHERE email = ? AND status = ?',
  [email, status]
);

// SQLite
const stmt = await db.prepare('SELECT * FROM users WHERE id = ?');
const result = await stmt.get(userId);
```

### Query Builders

```typescript
// Knex
const users = await knex('users')
  .where('email', email)
  .andWhere('status', 'active');

// Bookshelf
const users = await User.where('email', email).fetchAll();
```

### ORMs

```typescript
// Prisma
const user = await prisma.user.findUnique({
  where: { email: email },
});

// TypeORM
const user = await userRepository.findOne({
  where: { email: email },
});

// Sequelize
const user = await User.findOne({
  where: { email: email },
});

// Mongoose
const user = await User.findOne({ email: email });
```

## Related Rules

- [`no-xss-vulnerable`](no-xss-vulnerable.md) – XSS vulnerabilities
- [`no-command-injection`](no-command-injection.md) – Command injection
- [`no-unsafe-eval`](no-unsafe-eval.md) – Code injection

## See Also

- [Rules Index](../RULES.md) – Complete rules reference
- [OWASP: SQL Injection](https://owasp.org/www-community/SQL_Injection) – SQL injection guide
- [Bobby Tables](https://bobby-tables.com/) – SQL injection prevention
- [CWE-89: SQL Injection](https://cwe.mitre.org/data/definitions/89.html) – Common weakness
