# Pre-built Templates

Claude Anti-Slop includes pre-built templates for popular stacks. Install them directly into your memory to bootstrap your code-quality standards.

## Included Templates

| Stack | Categories | Files |
|-------|------------|-------|
| **Next.js** | standards, patterns | `react-components.md`, `nextjs-structure.md`, `custom-hooks.md` |
| **React** | standards | `testing.md` |
| **Node.js** | standards | `error-handling.md` |

## Install Templates

```bash
# Install all Next.js templates
claude-antislop templates install nextjs

# Install specific category
claude-antislop templates install nextjs --category standards

# Install to custom memory path
claude-antislop templates install react --memory ~/.custom-memory
```

## List Available Templates

```bash
# List all templates
claude-antislop templates list

# List templates for a stack
claude-antislop templates list nextjs
```

## Preview Templates

```bash
# Preview template content
claude-antislop templates preview nextjs/react-components
```

## Create Your Own

Templates live in `templates/` directory. Structure:

```
templates/
├── nextjs/
│   ├── standards/
│   │   ├── react-components.md
│   │   └── nextjs-structure.md
│   └── patterns/
│       └── custom-hooks.md
├── react/
│   └── standards/
│       └── testing.md
└── nodejs/
    └── standards/
        └── error-handling.md
```

## Usage Flow

1. Run `claude-antislop templates list` to see available templates
2. Install with `claude-antislop templates install <stack>`
3. Templates are copied to `~/.claude-antislop/memory/`
4. Use `claude-antislop memory-search` to find installed templates

## Contributing

Contribute templates by adding files to `templates/` and submitting a PR.

## See Also

- [Usage Guide](../docs/USAGE.md)
- [Memory Management](../docs/MEMORY.md)
