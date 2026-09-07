# Error Handling Standards

## Try-Catch Blocks

```typescript
async function getUser(id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User not found');
    return user;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error('Failed to get user:', error);
    throw new InternalError('Failed to fetch user');
  }
}
```

## Custom Error Classes

```typescript
class AppError extends Error {
  constructor(message: string, public code: string, public status: number) {
    super(message);
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}
```

## Error Middleware

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { message: err.message, code: err.code }
    });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: { message: 'Internal server error' } });
});
```

## Rules

- Never swallow errors silently
- Log errors with context
- Use custom error classes
- Return consistent error responses
- Validate input early
- Handle promise rejections
- Use `express-async-errors` or wrap async handlers

## Async Error Wrapper

```typescript
const asyncHandler = (fn: Function) => (
  req: Request, res: Response, next: NextFunction
) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
}));
```
