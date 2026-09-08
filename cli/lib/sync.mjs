import { existsSync } from 'fs';
import { join } from 'path';

const MEMORY_DIR = join(process.env.HOME || '', '.claude-antislop', 'memory');

export async function exportMemory(options = {}) {
  const { json } = options;

  if (!existsSync(MEMORY_DIR)) {
    throw new Error('Memory not initialized');
  }

  const files = [];

  if (json) {
    return JSON.stringify({ success: true, data: { files } }, null, 2);
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
