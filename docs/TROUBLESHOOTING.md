# Troubleshooting Guide

## Common Issues

### Installation Fails

#### Error: `command not found: claude-antislop`

**Solution:**
```bash
export PATH="$PATH:$(npm config get prefix)/bin"
# Or use npx
npx claude-antislop --help
```

#### Error: `EACCES: permission denied`

**Solution:**
```bash
npm config set prefix ~/.npm-global
export PATH="$PATH:~/.npm-global/bin"
```

### Memory Issues

#### Error: `Memory directory not found`

**Solution:**
```bash
claude-antislop init-memory
# Or with install
claude-antislop install --init-memory
```

#### Error: `Invalid category`

**Solution:**
Valid categories: `standards`, `patterns`, `anti-patterns`, `insights`, `reviews`

```bash
claude-antislop memory-write --category standards --filename test.md --content "test"
```

### Code Quality Checks

#### Error: `ESLint not configured`

**Solution:**
```bash
npm install --save-dev eslint
# Or skip lint check
claude-antislop code-quality-check --checks typecheck,prettier
```

#### Error: `Type errors found`

**Solution:**
```bash
npm install --save-dev typescript
# Or skip typecheck
claude-antislop code-quality-check --checks lint,prettier
```

#### Error: `Code is not formatted`

**Solution:**
```bash
npm install --save-dev prettier
prettier --write .
```

### MCP Integration

#### Error: `MCP server failed`

**Solution:**
```bash
node --version  # Must be >= 18
rm -rf node_modules package-lock.json
npm install
node mcp/mcp-server-index.mjs
```

### Git Learning

#### Error: `fatal: not a git repository`

**Solution:**
```bash
cd /path/to/your/repo
git status
claude-antislop learn-from-git --repo /path/to/repo
```

### Performance Issues

#### Slow memory search
```bash
claude-antislop memory-search --query "test" --limit 3
```

#### Large temp files
```bash
rm -rf ~/.claude-antislop/temp/*
```

## Debug Mode

```bash
claude-antislop install --verbose
claude-antislop scan --verbose
claude-antislop learn-from-git --verbose
```

## Getting Help

1. Check this troubleshooting guide
2. Search existing issues
3. Create a new issue with error details

## Contact

- **Email**: med@mednabouli.me
- **GitHub**: @mednabouli
- **Issues**: https://github.com/mednabouli/claude-antislop/issues
