import chokidar from 'chokidar';
import { join, relative, extname } from 'path';
import { ui } from './ui.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
const DEBOUNCE_MS = 500;
const IGNORE_PATTERNS = ['**/node_modules/**','**/.git/**','**/dist/**','**/build/**','**/*.test.*','**/*.spec.*','**/coverage/**','**/.cache/**','**/*.log'];
const WATCH_EXTENSIONS = ['.ts','.tsx','.js','.jsx','.vue','.svelte','.py','.go','.rs'];
export async function watchDirectory(options = {}) {
  const { repo = process.cwd(), verbose = false, json = false, quiet = false } = options;
  ui.divider(); ui.heading('👀 Watch Mode'); ui.divider(); console.log();
  ui.info(`Watching: ${repo}`); ui.info(`Extensions: ${WATCH_EXTENSIONS.join(', ')}`); console.log();
  let debounceTimer = null, lastChange = null;
  const runQualityCheck = async (filePath) => {
    try {
      const ext = extname(filePath); const language = getLanguage(ext); if (!language) return;
      const { stdout } = await execFileAsync('claude-antislop', ['code-quality-check','--language',language,'--checks','lint,typecheck','--json'], { cwd: repo });
      const result = JSON.parse(stdout);
      if (result.success) ui.success(`✓ ${relative(repo, filePath)} - No issues`);
      else { ui.error(`✗ ${relative(repo, filePath)} - ${result.message}`); if (result.hint) ui.info(`  Hint: ${result.hint}`); }
      return result;
    } catch (error) { if (verbose) ui.error(`Error checking ${filePath}: ${error.message}`); }
  };
  const handleChange = async (filePath) => {
    lastChange = filePath;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (lastChange !== filePath) return;
      const relPath = relative(repo, filePath); ui.info(`Changed: ${relPath}`);
      await runQualityCheck(filePath); lastChange = null;
    }, DEBOUNCE_MS);
  };
  const watcher = chokidar.watch(repo, { ignored: IGNORE_PATTERNS, persistent: true, ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 } });
  watcher.on('change', handleChange); watcher.on('add', handleChange);
  watcher.on('ready', () => { ui.success('Watcher ready'); console.log(); ui.info('Press Ctrl+C to stop'); });
  watcher.on('error', (error) => { ui.error(`Watcher error: ${error.message}`); });
  process.on('SIGINT', () => { ui.info('\nStopping watcher...'); watcher.close(); process.exit(0); });
  return watcher;
}
function getLanguage(ext) {
  const map = { '.ts':'typescript','.tsx':'typescript','.js':'javascript','.jsx':'javascript','.vue':'javascript','.svelte':'javascript','.py':'python','.go':'go','.rs':'rust' };
  return map[ext] || null;
}
