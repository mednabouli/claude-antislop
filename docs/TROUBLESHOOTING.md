# Troubleshooting Guide

Common issues and solutions for Claude Anti-Slop.

## Installation Issues

### `command not found: claude-antislop`

**Cause:** CLI not installed or not in PATH

**Solution:**
```bash
# Install globally
npm install -g claude-antislop

# Or run via npx
npx claude-antislop --help

# Check installation
which claude-antislop  # Linux/Mac
where claude-antislop  # Windows
```

### `npm install` fails

**Cause:** Node.js version too old or network issues

**Solution:**
```bash
# Check Node version (requires 18+)
node --version

# Update npm
npm install -g npm@latest

# Clear cache and retry
npm cache clean --force
npm install
```

## Memory Issues

### `Memory directory not found`

**Cause:** Memory not initialized

**Solution:**
```bash
claude-antislop init-memory
```

### `Memory directory already exists`

**Cause:** Trying to initialize existing memory

**Solution:**
```bash
# Use --force to overwrite
claude-antislop init-memory --force

# Or use existing memory
claude-antislop memory-search --query "your query"
```

### Memory search returns no results

**Cause:** No content matches query or wrong category

**Solution:**
```bash
# Search all categories
claude-antislop memory-search --query "test" --category all

# Check what's in memory
ls -la ~/.claude-antislop/memory/

# Add content to memory
claude-antislop memory-write --category standards --filename test.md --content "# Test"
```

## Shell Completion Issues

### Completion not working in Bash

**Cause:** Completion not sourced or wrong location

**Solution:**
```bash
# Install completion
claude-antislop completion install bash

# Or source manually
source <(claude-antislop completion bash)

# Add to .bashrc
echo 'source <(claude-antislop completion bash)' >> ~/.bashrc
source ~/.bashrc
```

### Completion not working in Zsh

**Cause:** Completion not in fpath or compinit not called

**Solution:**
```bash
# Install completion
claude-antislop completion install zsh

# Add to .zshrc
echo 'fpath=(~/.zfunc $fpath)' >> ~/.zshrc
echo 'autoload -Uz compinit' >> ~/.zshrc
echo 'compinit' >> ~/.zshrc
source ~/.zshrc
```

### Completion not working in Fish

**Cause:** Completion not in fish completions directory

**Solution:**
```bash
# Install completion
claude-antislop completion install fish

# Or source manually
claude-antislop completion fish | source
```

## Template Issues

### `Templates not found for stack`

**Cause:** Invalid stack name or templates directory missing

**Solution:**
```bash
# List available stacks
claude-antislop templates list

# Check templates directory
ls -la templates/

# Use valid stack name
claude-antislop templates install nextjs
```

### Templates not installing

**Cause:** Memory directory not initialized

**Solution:**
```bash
# Initialize memory first
claude-antislop init-memory

# Then install templates
claude-antislop templates install nextjs
```

## Localization Issues

### `Unsupported locale`

**Cause:** Invalid locale code

**Solution:**
```bash
# List supported locales
# en, fr, es, de, zh, ja

# Use valid locale
claude-antislop status --locale en
claude-antislop status --locale fr
```

### Messages not translated

**Cause:** Locale not set or translation missing

**Solution:**
```bash
# Set locale explicitly
claude-antislop status --locale fr

# Or set in config
# Edit ~/.claude-antislop/config.json
{
  "locales": ["fr"]
}
```

## Watch Mode Issues

### Watch mode not detecting changes

**Cause:** File system events not working or wrong directory

**Solution:**
```bash
# Use absolute path
claude-antislop watch --repo /absolute/path/to/repo

# Check if file is ignored
# Watch mode ignores: node_modules, .git, dist, build, *.test.*, etc.

# Use verbose mode for debugging
claude-antislop watch --verbose
```

### Watch mode consuming too much CPU

**Cause:** Too many files being watched

**Solution:**
```bash
# Exclude large directories
# Watch mode already ignores common directories

# Reduce debounce time (edit source)
# In cli/lib/watch.mjs, change DEBOUNCE_MS
```

## Performance Issues

### Slow scan on large repos

**Cause:** Many files to process

**Solution:**
```bash
# Scan specific directory
claude-antislop scan --repo ./src

# Use JSON output for faster processing
claude-antislop scan --repo . --json > scan.json
```

### High memory usage

**Cause:** Large repository or many templates

**Solution:**
```bash
# Limit scan depth
# (Future: add --max-depth flag)

# Clear memory cache
rm -rf ~/.claude-antislop/memory/templates
```

## CI/CD Issues

### GitHub Action fails with `command not found`

**Cause:** CLI not installed in CI environment

**Solution:**
```yaml
# In .github/workflows/ci.yml
- name: Install claude-antislop
  run: npm install -g claude-antislop

# Or run from repo
- name: Run CLI
  run: node cli/index.mjs status
```

### Tests failing in CI

**Cause:** Missing dependencies or environment issues

**Solution:**
```yaml
# Ensure all dependencies installed
- name: Install dependencies
  run: npm ci

# Run tests with verbose output
- name: Run tests
  run: npm test -- --verbose
```

## Common Error Messages

### `Error: Cannot find module 'commander'`

**Solution:**
```bash
npm install
```

### `Error: EACCES: permission denied`

**Solution:**
```bash
# Fix permissions
sudo chown -R $(whoami) ~/.claude-antislop

# Or reinstall
npm install -g claude-antislop --unsafe-perm
```

### `Error: ENOENT: no such file or directory`

**Solution:**
```bash
# Check file exists
ls -la path/to/file

# Create missing directories
mkdir -p ~/.claude-antislop/memory
```

## Getting Help

### Still having issues?

1. **Check documentation**: https://github.com/mednabouli/claude-antislop/tree/main/docs
2. **Search issues**: https://github.com/mednabouli/claude-antislop/issues
3. **Create issue**: Include error message, steps to reproduce, environment details
4. **Join discussions**: https://github.com/mednabouli/claude-antislop/discussions

### Debug Mode

```bash
# Enable verbose logging
claude-antislop status --verbose

# Check CLI version
claude-antislop --version

# Check Node version
node --version

# Check npm version
npm --version
```

### System Information

When reporting issues, include:
```bash
# OS
uname -a  # Linux/Mac
systeminfo  # Windows

# Node
node --version

# npm
npm --version

# CLI
c laude-antislop --version
```

---

**Still stuck?** Create an issue with the error message and steps to reproduce! 🐛
