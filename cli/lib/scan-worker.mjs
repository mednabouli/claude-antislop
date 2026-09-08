import { parentPort, workerData } from 'worker_threads';
import { readdirSync } from 'fs';
import { join } from 'path';

const { dir, extensions } = workerData;
const files = [];

function walk(currentDir) {
  const entries = readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(currentDir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
        walk(full);
      }
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
}

try {
  walk(dir);
  parentPort.postMessage({ success: true, files });
} catch (error) {
  parentPort.postMessage({ success: false, error: error.message });
}
