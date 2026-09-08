# Python Type Hints Standards

## Function Annotations

```python
from typing import List, Dict, Optional, Union, Callable
from dataclasses import dataclass

# Basic types
def greet(name: str, count: int) -> str:
    return f"Hello {name} ({count})"

# Optional types
def find_user(user_id: int) -> Optional[dict]:
    """Find user by ID, returns None if not found"""
    return users.get(user_id)

# Union types
def parse_value(value: Union[str, int, float]) -> str:
    return str(value)

# Collection types
def process_items(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}

# Callable types
def apply_function(items: List[int], func: Callable[[int], int]) -> List[int]:
    return [func(item) for item in items]

# Data classes
@dataclass
class User:
    id: int
    name: str
    email: str
    active: bool = True
```

## Rules

- Always add type hints to function parameters
- Always add return type annotations
- Use `Optional[T]` for values that can be `None`
- Use `Union[T, U]` for multiple types
- Use `List[T]`, `Dict[K, V]` for collections
- Use dataclasses for structured data

## Best Practices

### 1. Use Type Aliases
```python
from typing import TypeAlias

UserId: TypeAlias = int
UserData: TypeAlias = Dict[str, Union[str, int]]

def get_user(user_id: UserId) -> UserData:
    ...
```

### 2. Use Generics
```python
from typing import TypeVar, Generic

T = TypeVar('T')

class Repository(Generic[T]):
    def get(self, id: int) -> T:
        ...
    
    def save(self, item: T) -> None:
        ...
```

### 3. Use Protocols
```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None:
        ...

def render(shape: Drawable) -> None:
    shape.draw()
```

### 4. Use TypedDict
```python
from typing import TypedDict

class UserDict(TypedDict):
    id: int
    name: str
    email: str

def create_user(data: UserDict) -> User:
    ...
```

## Tools

- **mypy** - Static type checker
- **pyright** - Microsoft's type checker
- **pydantic** - Runtime type validation

## Commands

```bash
# Install mypy
pip install mypy

# Run type checking
mypy my_project/

# Strict mode
mypy --strict my_project/
```

## Tips

- Start with function signatures
- Add types incrementally
- Use `# type: ignore` sparingly
- Keep types DRY (use aliases)
- Document complex types
