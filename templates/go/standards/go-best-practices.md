# Go Best Practices

## Project Structure

```
myproject/
├── cmd/
│   └── myapp/
│       └── main.go
├── internal/
│   ├── handler/
│   ├── service/
│   └── repository/
├── pkg/
│   └── utils/
├── api/
│   └── openapi.yaml
├── go.mod
├── go.sum
└── Makefile
```

## Code Style

```go
package main

import (
    "context"
    "errors"
    "fmt"
)

// Constants first
const (
    DefaultPort = 8080
    MaxRetries  = 3
)

// Variables after constants
var (
    ErrNotFound = errors.New("not found")
    ErrInvalid  = errors.New("invalid")
)

// Types
type User struct {
    ID    int64  `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// Interfaces
type UserRepository interface {
    GetByID(ctx context.Context, id int64) (*User, error)
    Save(ctx context.Context, user *User) error
}

// Functions
func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

// Error handling
func findUser(id int64) (*User, error) {
    if id <= 0 {
        return nil, ErrInvalid
    }
    
    user, err := getUserFromDB(id)
    if err != nil {
        return nil, fmt.Errorf("get user: %w", err)
    }
    
    if user == nil {
        return nil, ErrNotFound
    }
    
    return user, nil
}

// Context usage
func process(ctx context.Context, id int64) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    default:
        // Process
        return nil
    }
}
```

## Rules

- Use `go fmt` for formatting
- Use `go vet` for linting
- Handle errors explicitly
- Use context for cancellation
- Keep functions small and focused
- Write tests for all public functions

## Best Practices

### 1. Error Handling
```go
// Wrap errors with context
if err != nil {
    return fmt.Errorf("process file: %w", err)
}

// Check errors explicitly
if err := doSomething(); err != nil {
    log.Printf("failed: %v", err)
    return err
}
```

### 2. Context
```go
// Pass context as first parameter
func DoSomething(ctx context.Context, arg string) error

// Respect cancellation
select {
case <-ctx.Done():
    return ctx.Err()
default:
    // Continue
}
```

### 3. Testing
```go
func TestGreet(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected string
    }{
        {"basic", "World", "Hello, World!"},
        {"empty", "", "Hello, !"},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := greet(tt.input)
            if got != tt.expected {
                t.Errorf("got %q, want %q", got, tt.expected)
            }
        })
    }
}
```

## Tools

- **golangci-lint** - Linter aggregator
- **staticcheck** - Advanced linter
- **go test** - Built-in testing

## Commands

```bash
# Format code
go fmt ./...

# Run tests
go test ./...

# Run linters
golangci-lint run

# Build
go build -o bin/app ./cmd/myapp
```

## Tips

- Keep it simple (KISS)
- Favor readability over cleverness
- Use standard library when possible
- Document public APIs
- Write meaningful tests
