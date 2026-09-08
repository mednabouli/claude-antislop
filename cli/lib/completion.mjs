import fs from 'fs-extra';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ui } from './ui.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPLETION_DIR = join(__dirname, '..', 'completions');
const SHELLS = {
  bash: { file: 'claude-antislop.bash', candidates: [join(homedir(), '.local', 'share', 'bash-completion', 'completions'), join(homedir(), '.bash_completion.d')] },
  zsh: { file: '_claude-antislop', candidates: [join(homedir(), '.zsh', 'completions'), join(homedir(), '.zfunc')] },
  fish: { file: 'claude-antislop.fish', candidates: [join(homedir(), '.config', 'fish', 'completions')] }
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
  return { shell, destination, restartHint: `Start new ${shell} session` };
}
