import fs from 'fs-extra';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPLETION_DIR = join(__dirname, '..', 'completions');

const SHELLS = {
  bash: {
    file: 'claude-antislop.bash',
    candidates: [
      process.env.XDG_DATA_HOME ? join(process.env.XDG_DATA_HOME, 'bash-completion', 'completions') : null,
      join(homedir(), '.local', 'share', 'bash-completion', 'completions'),
      join(homedir(), '.bash_completion.d')
    ].filter(Boolean)
  },
  zsh: {
    file: '_claude-antislop',
    candidates: [
      process.env.ZDOTDIR ? join(process.env.ZDOTDIR, 'completions') : null,
      join(homedir(), '.zsh', 'completions'),
      join(homedir(), '.zfunc')
    ].filter(Boolean)
  },
  fish: {
    file: 'claude-antislop.fish',
    candidates: [
      process.env.XDG_CONFIG_HOME ? join(process.env.XDG_CONFIG_HOME, 'fish', 'completions') : null,
      join(homedir(), '.config', 'fish', 'completions')
    ].filter(Boolean)
  }
};

export function getSupportedShells() {
  return Object.keys(SHELLS);
}

export async function getCompletionScript(shell) {
  const definition = SHELLS[shell];
  if (!definition) throw new Error(`Unsupported shell: ${shell}. Supported: ${getSupportedShells().join(', ')}`);
  return fs.readFile(join(COMPLETION_DIR, definition.file), 'utf8');
}

export async function installCompletion(shell, targetDirectory) {
  const definition = SHELLS[shell];
  if (!definition) throw new Error(`Unsupported shell: ${shell}. Supported: ${getSupportedShells().join(', ')}`);
  const destinationDirectory = targetDirectory || definition.candidates[0];
  if (!destinationDirectory) throw new Error(`No default directory for ${shell}. Provide --path.`);
  const source = join(COMPLETION_DIR, definition.file);
  const destination = join(destinationDirectory, definition.file);
  await fs.ensureDir(destinationDirectory);
  await fs.copyFile(source, destination);
  return { shell, destination, restartHint: getRestartHint(shell, destinationDirectory) };
}

function getRestartHint(shell, directory) {
  if (shell === 'bash') return `Start new Bash, or: source ${join(directory, 'claude-antislop.bash')}`;
  if (shell === 'zsh') return `Start new Zsh, or: fpath=(${directory} $fpath); autoload -Uz compinit; compinit`;
  return 'Start new Fish, or: fish_update_completions';
}
