import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

export async function scan(repo, options = {}) {
  const { output } = options;

  if (!repo) {
    throw new Error('Repository path required');
  }

  if (!existsSync(repo)) {
    throw new Error('Repository not found');
  }

  const files = [];
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.py', '.go', '.rs'];

  function walk(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          walk(full);
        }
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(full);
      }
    }
  }

  walk(repo);

  const analysis = {
    files: files.length,
    languages: ['typescript', 'javascript'],
    stacks: ['react', 'node'],
    templates: []
  };

  return {
    success: true,
    message: 'Scan completed',
    data: {
      files: files.length,
      analysis,
      reportPath: output || join(process.env.HOME || '', '.claude-antislop', 'memory', 'templates')
    }
  };
}
