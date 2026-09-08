import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI = 'node ' + join(__dirname, '..', '..', 'cli', 'index.mjs');

describe('Complete Workflows', () => {
  test('should complete completion workflow', () => {
    const stdout = execSync(`${CLI} completion bash`, { shell: true, encoding: 'utf8' });
    expect(stdout).toContain('_complete_claude_antislop');
  });
});
