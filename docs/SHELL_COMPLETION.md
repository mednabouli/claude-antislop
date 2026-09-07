# Shell Completion

Claude Anti-Slop provides completions for **Bash**, **Zsh**, and **Fish**.

## Print a Script

```bash
claude-antislop completion bash
claude-antislop completion zsh
claude-antislop completion fish
```

Source for current session:
```bash
source <(claude-antislop completion bash)
source <(claude-antislop completion zsh)
claude-antislop completion fish | source
```

## Install Permanently

```bash
claude-antislop completion install bash
claude-antislop completion install zsh
claude-antislop completion install fish
```

Custom directory:
```bash
claude-antislop completion install zsh --path ~/.zfunc
```

Start a new shell. For Zsh, ensure in `.zshrc`:
```zsh
autoload -Uz compinit
compinit
```

## Manual Installation

### Bash
```bash
mkdir -p ~/.local/share/bash-completion/completions
claude-antislop completion bash > ~/.local/share/bash-completion/completions/claude-antislop
```

### Zsh
```bash
mkdir -p ~/.zfunc
claude-antislop completion zsh > ~/.zfunc/_claude-antislop
printf '\nfpath=(~/.zfunc $fpath)\nautoload -Uz compinit\ncompinit\n' >> ~/.zshrc
```

### Fish
```bash
mkdir -p ~/.config/fish/completions
claude-antislop completion fish > ~/.config/fish/completions/claude-antislop.fish
```

## Verification

```bash
claude-antislop <TAB>
claude-antislop memory-search --category <TAB>
claude-antislop learn-from-git --recent <TAB>
```
