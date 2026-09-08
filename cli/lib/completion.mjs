export function generateCompletion(shell) {
  const configs = {
    bash: {
      file: 'claude-antislop.bash',
      content: `# Claude Antislop Bash Completion
_complete_claude_antislop() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  COMPREPLY=( \$(compgen -W "init-memory memory-write memory-search memory-sync scan templates code-quality-check status" -- "\${cur}") )
}
complete -F _complete_claude_antislop claude-antislop
`
    },
    zsh: {
      file: '_claude-antislop',
      content: `# Claude Antislop Zsh Completion
#compdef claude-antislop

local -a _commands
_commands=(
  'init-memory:Initialize memory system'
  'memory-write:Write to memory'
  'memory-search:Search memory'
  'memory-sync:Sync memory'
  'scan:Scan repository'
  'templates:Manage templates'
  'code-quality-check:Check code quality'
  'status:Show status'
)

_arguments '1: :->commands' && return 0

case "$state" in
  commands)
    _describe 'commands' _commands
    ;;
esac
`
    },
    fish: {
      file: 'claude-antislop.fish',
      content: `# Fish completion for claude-antislop
complete -c claude-antislop -n "not __fish_seen_subcommand_from" -a "init-memory memory-write memory-search memory-sync scan templates code-quality-check status"
`
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
