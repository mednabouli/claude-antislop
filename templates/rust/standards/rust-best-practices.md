# Rust Best Practices

## Project Structure

```
myproject/
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── error.rs
│   ├── config.rs
│   └── utils.rs
├── tests/
│   └── integration_test.rs
├── Cargo.toml
└── Cargo.lock
```

## Code Style

```rust
use std::error::Error;
use std::fmt;

// Error types
#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    InvalidInput(String),
    Io(std::io::Error),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            AppError::Io(err) => write!(f, "IO error: {}", err),
        }
    }
}

impl Error for AppError {}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::Io(err)
    }
}

// Result type alias
pub type Result<T> = std::result::Result<T, AppError>;

// Structs with derive macros
#[derive(Debug, Clone, PartialEq)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
}

impl User {
    pub fn new(id: u64, name: String, email: String) -> Self {
        Self { id, name, email }
    }
    
    pub fn validate(&self) -> Result<()> {
        if self.name.is_empty() {
            return Err(AppError::InvalidInput("Name is required".into()));
        }
        if !self.email.contains('@') {
            return Err(AppError::InvalidInput("Invalid email".into()));
        }
        Ok(())
    }
}

// Functions with proper error handling
fn find_user(id: u64) -> Result<User> {
    if id == 0 {
        return Err(AppError::InvalidInput("ID must be positive".into()));
    }
    
    // Simulate database lookup
    Ok(User::new(id, "John".into(), "john@example.com".into()))
}

// Async functions
async fn fetch_user(id: u64) -> Result<User> {
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    find_user(id)
}

// Tests
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_user_validation() {
        let user = User::new(1, "John".into(), "john@example.com".into());
        assert!(user.validate().is_ok());
    }
    
    #[test]
    fn test_invalid_email() {
        let user = User::new(1, "John".into(), "invalid".into());
        assert!(user.validate().is_err());
    }
}
```

## Rules

- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Handle errors with `Result<T, E>`
- Use derive macros (`Debug`, `Clone`, etc.)
- Write tests for all public functions
- Use `cargo test` for testing

## Best Practices

### 1. Error Handling
```rust
// Use ? operator for propagation
fn process() -> Result<()> {
    let file = std::fs::File::open("data.txt")?;
    let contents = std::io::read_to_string(file)?;
    Ok(())
}

// Map errors with context
fn parse_number(s: &str) -> Result<i32> {
    s.parse().map_err(|e| {
        AppError::InvalidInput(format!("Parse error: {}", e))
    })
}
```

### 2. Ownership
```rust
// Borrow instead of clone when possible
fn process(data: &str) -> String {
    data.to_uppercase()
}

// Use Cow for zero-copy when possible
use std::borrow::Cow;

fn normalize(s: &str) -> Cow<str> {
    if s.trim() == s {
        Cow::Borrowed(s)
    } else {
        Cow::Owned(s.trim().to_string())
    }
}
```

### 3. Concurrency
```rust
use std::sync::{Arc, Mutex};

// Thread-safe shared state
let data = Arc::new(Mutex::new(Vec::new()));

// Use tokio for async
#[tokio::main]
async fn main() {
    let handle = tokio::spawn(async {
        // Async work
    });
    handle.await.unwrap();
}
```

## Tools

- **cargo fmt** - Code formatter
- **cargo clippy** - Linter
- **cargo test** - Test runner
- **cargo audit** - Security audit

## Commands

```bash
# Format code
cargo fmt

# Run linter
cargo clippy -- -D warnings

# Run tests
cargo test

# Build release
cargo build --release

# Check for security issues
cargo audit
```

## Tips

- Let the compiler guide you
- Use strong types to prevent errors
- Prefer composition over inheritance
- Write tests as you code
- Read the Rust book
