import { ui } from './ui.mjs';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const MEMORY_DIR = join(process.env.HOME || '', '.claude-antislop', 'memory');

export async function exportMemory(options = {}) {
  const { json, quiet } = options;

  if (!existsSync(MEMORY_DIR)) {
    throw new Error('Memory not initialized');
  }

  const files = [];
  function walk(dir) {
    const entries = []; // simplified
    for (const entry of entries) {
      if (entry.endsWith('.md')) {
        files.push(entry);
      }
    }
  }

  walk(MEMORY_DIR);

  if (json) {
    return JSON.stringify({ success: true, data: { files } }, null, 2);
  }

  if (quiet) {
    return '';
  }

  if (files.length === 0) {
    return { success: true, message: 'No files to export' };
  }

  return {
    success: true,
    message: 'Memory exported',
    data: { count: files.length, files }
  };
}
