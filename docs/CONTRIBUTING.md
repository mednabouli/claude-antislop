# Contributing Guide

Thank you for considering contributing to Claude Anti-Slop!

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Welcome newcomers and help them learn
- Keep discussions professional and on-topic

## Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/claude-antislop.git
cd claude-antislop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Running Tests
```bash
npm test
npm run test:coverage
npm test -- tests/memory.test.mjs
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

### Development Mode
```bash
npm run dev
```

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Documentation updated
- [ ] Commit messages are clear

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
```

## Code Style

### JavaScript/TypeScript

- Use ES modules (`import`/`export`)
- Prefer `const` over `let`
- Use async/await for async code
- Add JSDoc comments for public APIs

### File Naming

- Use `.mjs` extension for ES modules
- Lowercase with hyphens: `memory-search.mjs`
- Test files: `*.test.mjs`

### Commit Messages

```
feat: add fuzzy matching to memory search

- Implement calculateFuzzyScore function
- Add partial match support
- Update tests

Fixes #123
```

## Architecture

```
claude-antislop/
├── cli/           # CLI implementation
│   ├── index.mjs  # Entry point
│   └── lib/       # CLI libraries
├── mcp/           # MCP server
├── plugin/        # Claude Code plugin
├── tests/         # Test suite
└── docs/          # Documentation
```

## Areas for Contribution

### High Priority
- Bug fixes
- Test coverage improvements
- Documentation enhancements
- Performance optimizations

### Medium Priority
- New CLI commands
- Additional pattern detectors
- MCP tool enhancements
- CI/CD improvements

### Nice to Have
- Shell completions
- Interactive tutorials
- Localization support
- Plugin ecosystem extensions

## Questions?

- Open an issue for bugs
- Use discussions for questions
- Contact: med@mednabouli.me

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
