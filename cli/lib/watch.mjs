import { ui } from './ui.mjs';
import { join } from 'path';
import { watch } from 'chokidar';

export function watchDirectory(dir, options = {}) {
  const { extensions, ignore } = options;

  if (!dir) {
    throw new Error('Directory required');
  }

  const exts = extensions || ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.py', '.go', '.rs'];
  const ignored = ignore || ['**/node_modules/**', '**/.git/**', '**/dist/**'];

  ui.divider();
  ui.heading('👀 Watch Mode');
  ui.divider();
  ui.info(`Watching: ${dir}`);
  ui.info(`Extensions: ${exts.join(', ')}`);

  const watcher = watch(dir, {
    ignored,
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', path => {
    if (exts.some(ext => path.endsWith(ext))) {
      ui.info(`Changed: ${path}`);
    }
  });

  watcher.on('add', path => {
    if (exts.some(ext => path.endsWith(ext))) {
      ui.info(`Added: ${path}`);
    }
  });

  return {
    success: true,
    message: 'Watch started',
    data: { dir, extensions: exts }
  };
}
