export function generateCompletion(shell) {
  const configs = {
    bash: {
      file: 'claude-antislop.bash',
      content: '# Claude Antislop Bash Completion\n_complete_claude_antislop() {\n  local cur="${COMP_WORDS[COMP_CWORD]}"\n  COMPREPLY=( $(compgen -W "init-memory memory-write memory-search memory-sync scan templates code-quality-check status" -- "${cur}") )\n}\ncomplete -F _complete_claude_antislop claude-antislop\n'
    },
    zsh: {
      file: '_claude-antislop',
      content: '# Claude Antislop Zsh Completion\n#compdef claude-antislop\n\nlocal -a _commands\n_commands=(\n  \'init-memory:Initialize memory system\'\n  \'memory-write:Write to memory\'\n  \'memory-search:Search memory\'\n  \'memory-sync:Sync memory\'\n  \'scan:Scan repository\'\n  \'templates:Manage templates\'\n  \'code-quality-check:Check code quality\'\n  \'status:Show status\'\n)\n\n_arguments \'1: :->commands\' && return 0\n\ncase "$state" in\n  commands)\n    _describe \'commands\' _commands\n    ;;\nesac\n'
    },
    fish: {
      file: 'claude-antislop.fish',
      content: '# Fish completion for claude-antislop\ncomplete -c claude-antislop -n "not __fish_seen_subcommand_from" -a "init-memory memory-write memory-search memory-sync scan templates code-quality-check status"\n'
    }
  };

  if (!configs[shell]) {
    throw new Error('Unsupported shell');
  }

  return configs[shell].content;
}

export function getCompletionScript(shell) {
  return generateCompletion(shell);
}

export function getSupportedShells() {
  return ['bash', 'zsh', 'fish'];
}
