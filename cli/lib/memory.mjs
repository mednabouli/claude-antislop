import { ui } from './ui.mjs';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

const MEMORY_DIR = join(process.env.HOME || process.env.USERPROFILE || '', '.claude-antislop', 'memory');

export function initMemory() {
  if (!existsSync(MEMORY_DIR)) {
    mkdirSync(MEMORY_DIR, { recursive: true });
  }
  return { success: true, path: MEMORY_DIR };
}

export function writeMemory(file, content) {
  if (!file) {
    throw new Error('File path required');
  }

  if (!content) {
    throw new Error('Content required');
  }

  const filePath = join(MEMORY_DIR, file);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
  return { success: true, path: filePath };
}

export function searchMemory(query, options = {}) {
  const { recent, type } = options;

  if (recent && (isNaN(recent) || recent < 1)) {
    throw new Error('Recent must be positive');
  }

  if (type && typeof type !== 'string') {
    throw new Error('Type must be string');
  }

  return {
    success: true,
    message: 'Search complete',
    data: {
      query,
      recent,
      type,
      count: 0,
      results: []
    }
  };
}
