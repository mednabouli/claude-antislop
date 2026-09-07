# First-Run Wizard

Claude Anti-Slop includes an **interactive first-run wizard** to help you set up the tool quickly.

## Start the Wizard

```bash
claude-antislop wizard
```

## Wizard Steps

### 1. Stack Selection

Choose your primary development stack:

- Next.js (React + TypeScript)
- React + TypeScript
- Vue 3 + TypeScript
- Svelte + TypeScript
- Node.js Backend
- Python Backend
- Custom Stack

### 2. Locale Selection

Select your preferred locale:

- English
- French
- Spanish
- German
- Chinese
- Japanese
- Custom

### 3. Feature Configuration

Toggle optional features:

- **Git learning** - Analyze Git history for patterns
- **Auto-update memory** - Automatically update memory from scans
- **Review mode** - Enable review mode for code reviews

### 4. Memory Initialization

Initialize memory directories with categories:

- standards/
- patterns/
- anti-patterns/
- insights/
- reviews/

### 5. Shell Completion

Install shell completion for your current shell (Bash, Zsh, or Fish).

### 6. Save Configuration

Save your configuration to `~/.claude-antislop/config.json`.

## Example Session

```bash
$ claude-antislop wizard

────────────────────────────────────────────────────────────
🚀 Claude Anti-Slop Setup Wizard
────────────────────────────────────────────────────────────

ℹ Welcome! Let's set up Claude Anti-Slop for your workflow.

1. Select your stack
  1. Next.js (React + TypeScript)
  2. React + TypeScript
  3. Vue 3 + TypeScript
  4. Svelte + TypeScript
  5. Node.js Backend
  6. Python Backend
  7. Custom Stack
Enter stack number (1-7): 1
✓ Selected: Next.js (React + TypeScript)

2. Select your locale
  1. English
  2. French
  3. Spanish
  4. German
  5. Chinese
  6. Japanese
  7. Custom
Enter locale number (1-7): 1
✓ Selected: English

3. Configure optional features
Enable Git learning? (y/N): y
✓ Git learning: enabled
Enable auto-update memory? (y/N): n
✓ Auto-update memory: disabled
Enable review mode? (Y/n): y
✓ Review mode: enabled

4. Initialize memory
Initialize memory directories? (Y/n): y
✓ Memory initialized

5. Shell completion
Install shell completion? (Y/n): y
✓ Completion installed for zsh
ℹ Destination: /Users/med/.zfunc/_claude-antislop

ℹ Start new Zsh, or: fpath=(/Users/med/.zfunc $fpath); autoload -Uz compinit; compinit

6. Save configuration
✓ Configuration saved
ℹ Location: /Users/med/.claude-antislop/config.json

────────────────────────────────────────────────────────────
✅ Setup Complete!
────────────────────────────────────────────────────────────

ℹ Quick start commands:
  claude-antislop status          - Check plugin status
  claude-antislop memory-search   - Search memory
  claude-antislop scan            - Scan a repository
  claude-antislop learn-from-git  - Learn from Git history

ℹ Documentation: https://github.com/mednabouli/claude-antislop
```

## Skip the Wizard

To skip the wizard and use defaults:

```bash
claude-antislop install --init-memory
```

## Re-run the Wizard

You can re-run the wizard anytime to update your configuration:

```bash
claude-antislop wizard
```

## Configuration File

The wizard saves your configuration to `~/.claude-antislop/config.json`:

```json
{
  "defaultStack": ["nextjs"],
  "locales": ["en"],
  "features": {
    "learnFromGit": true,
    "autoUpdateMemory": false,
    "reviewMode": true
  }
}
```

## See Also

- [Installation Guide](INSTALL.md)
- [Usage Guide](USAGE.md)
- [CLI Reference](CLI.md)
