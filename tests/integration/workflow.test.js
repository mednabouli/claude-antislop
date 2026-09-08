import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI = 'node ' + join(__dirname, '..', '..', 'cli', 'index.mjs');

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    const child = require('child_process').exec(cmd, { shell: true }, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
  });
}

describe('Complete Workflows', () => {
  test('should complete completion workflow', async () => {
    const { stdout } = await execAsync(`${CLI} completion bash`);
    expect(stdout).toContain('_complete_claude_antislop');
  });
});
