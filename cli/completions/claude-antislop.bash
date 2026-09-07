# Bash completion for claude-antislop
_claude_antislop() {
  local cur prev commands categories checks periods
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"
  commands="install status scan learn-from-git memory-search memory-write code-quality-check mcp-server init-memory completion"
  categories="all standards patterns anti-patterns insights reviews"
  checks="lint typecheck prettier"
  periods="1d 7d 14d 30d 60d 90d 3m 6m 1y"
  case "${prev}" in
    --category) COMPREPLY=( $(compgen -W "${categories}" -- "${cur}") ); return 0 ;;
    --checks) COMPREPLY=( $(compgen -W "${checks}" -- "${cur}") ); return 0 ;;
    --language) COMPREPLY=( $(compgen -W "javascript typescript" -- "${cur}") ); return 0 ;;
    --recent) COMPREPLY=( $(compgen -W "${periods}" -- "${cur}") ); return 0 ;;
    --repo|--output|--path) COMPREPLY=( $(compgen -d -- "${cur}") ); return 0 ;;
    --filename) COMPREPLY=( $(compgen -f -- "${cur}") ); return 0 ;;
  esac
  local command=""
  for word in "${COMP_WORDS[@]:1}"; do
    case "${word}" in ${commands}) command="${word}"; break ;; esac
  done
  case "${command}" in
    install) COMPREPLY=( $(compgen -W "--init-memory --verbose --help" -- "${cur}") ) ;;
    status) COMPREPLY=( $(compgen -W "--verbose --help" -- "${cur}") ) ;;
    scan) COMPREPLY=( $(compgen -W "--repo --output --verbose --help" -- "${cur}") ) ;;
    learn-from-git) COMPREPLY=( $(compgen -W "--repo --recent --verbose --help" -- "${cur}") ) ;;
    memory-search) COMPREPLY=( $(compgen -W "--query --category --limit --fuzzy --help" -- "${cur}") ) ;;
    memory-write) COMPREPLY=( $(compgen -W "--category --filename --content --append --help" -- "${cur}") ) ;;
    code-quality-check) COMPREPLY=( $(compgen -W "--code --language --checks --help" -- "${cur}") ) ;;
    init-memory) COMPREPLY=( $(compgen -W "--force --verbose --help" -- "${cur}") ) ;;
    completion) COMPREPLY=( $(compgen -W "bash zsh fish install --path --help" -- "${cur}") ) ;;
    *) COMPREPLY=( $(compgen -W "${commands} --help --version" -- "${cur}") ) ;;
  esac
}
complete -F _claude_antislop claude-antislop
