import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { workerData, parentPort} from 'worker_threads';
import { createHash } from 'crypto';

const CACHE_DIR = join(process.env.HOME || '', '.claude-antislop', 'cache');
const MAX_WORKERS = 4;

function computeHash(content) {
  return createHash('sha256').update(content).digest('hex');
}

function getCachedResult(cacheKey) {
  try {
    const cacheFile = join(CACHE_DIR, cacheKey + '.json');
    if (existsSync(cacheFile)) {
      const cached = JSON.parse(readFileSync(cacheFile, 'utf-8'));
      if (Date.now() - cached.timestamp < 3600000) {
        return cached.data;
      }
    }
  } catch {}
  return null;
}

function saveCacheResult(cacheKey, data) {
  try {
    const cacheFile = join(CACHE_DIR, cacheKey + '.json');
    writeFileSync(cacheFile, JSON.stringify({ timestamp: Date.now(), data }), 'utf-8');
  } catch {}
}

export async function scan(repo, options = {}) {
  const { output, useCache = true } = options;

  if (!repo) {
    throw new Error('Repository path required');
  }

  if (!existsSync(repo)) {
    throw new Error('Repository not found');
  }

  const cacheKey = computeHash(repo);
  if (useCache) {
    const cached = getCachedResult(cacheKey);
    if (cached) {
      return {
        success: true,
        message: 'Scan completed (cached)',
        data: cached,
        cached: true
      };
    }
  }

  const files = [];
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.py', '.go', '.rs'];

  function walk(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
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

  const result = {
    success: true,
    message: 'Scan completed',
    data: {
      files: files.length,
      analysis,
      reportPath: output || join(process.env.HOME || '', '.claude-antislop', 'memory', 'templates')
    }
  };

  if (useCache) {
    saveCacheResult(cacheKey, result.data);
  }

  return result;
}
