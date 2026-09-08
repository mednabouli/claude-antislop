# Smart Templates

Smart Templates provide one-command installation of pre-built code-quality standards for popular stacks.

## Quick Start

```bash
# List available templates
claude-antislop templates list

# Install all Next.js templates
claude-antislop templates install nextjs

# Install specific category
claude-antislop templates install react --category standards

# Preview a template
claude-antislop templates preview nextjs/standards/react-components
```

## Available Stacks

| Stack | Categories | Files | Description |
|-------|------------|-------|-------------|
| **nextjs** | standards, patterns | 3 | React components, Next.js structure, custom hooks |
| **react** | standards | 1 | Testing standards |
| **vue** | standards, patterns | 2 | Composition API, Pinia patterns |
| **svelte** | standards | 1 | Svelte best practices |
| **nodejs** | standards, patterns | 2 | Error handling, Express patterns |
| **python** | standards | 2 | Type hints, testing |
| **general** | standards, patterns, anti-patterns | 5 | Universal best practices |

## Commands

### List Templates

```bash
# All templates
claude-antislop templates list

# JSON output
claude-antislop templates list --json
```

### Install Templates

```bash
# Install all templates for a stack
claude-antislop templates install nextjs

# Install specific category
claude-antislop templates install react --category standards

# Install to custom memory path
claude-antislop templates install nodejs --memory ~/.custom-memory

# JSON output
claude-antislop templates install nextjs --json
```

### Preview Templates

```bash
# Preview template content
claude-antislop templates preview nextjs/standards/react-components

# JSON output
claude-antislop templates preview react/standards/testing --json
```

## Template Structure

Templates live in `templates/` directory:

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

## Contributing Templates

### Add New Stack

1. Create directory: `templates/your-stack/`
2. Add categories: `standards/`, `patterns/`, `anti-patterns/`
3. Add markdown files with your standards
4. Update `STACKS` object in `cli/lib/templates.mjs`
5. Test with `claude-antislop templates list`

### Template Format

```markdown
# Your Standard Title

## Section

Description of the standard.

### Example

```typescript
// Code example
```

## Rules

- Rule 1
- Rule 2
- Rule 3
```

### Best Practices

- Use clear, descriptive titles
- Include code examples
- Keep files focused (< 500 lines)
- Use markdown formatting
- Test templates before submitting

## Community Marketplace

Future: Download community templates:

```bash
# Browse marketplace
claude-antislop templates marketplace browse

# Install community template
claude-antislop templates marketplace install username/repo

# Submit template
claude-antislop templates marketplace submit
```

## Tips

- Install templates before starting a new project
- Combine with `claude-antislop scan` for best results
- Customize installed templates to your needs
- Contribute your own templates back

## See Also

- [Usage Guide](USAGE.md)
- [Memory Management](MEMORY.md)
- [Pre-built Templates](../templates/README.md)
