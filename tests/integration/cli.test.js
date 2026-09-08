import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI = 'node ' + join(__dirname, '..', '..', 'cli', 'index.mjs');

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    execSync(cmd, { shell: true, encoding: 'utf8' })
      .then(stdout => resolve({ stdout, stderr: '' }))
      .catch(err => reject(err));
  });
}

describe('CLI Integration Tests', () => {
  test('should show help', async () => {
    const { stdout } = await execAsync(`${CLI} --help`);
    expect(stdout).toContain('Usage');
  });

  test('should show version', async () => {
    const { stdout } = await execAsync(`${CLI} --version`);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  test('should show completion script', async () => {
    const { stdout } = await execAsync(`${CLI} completion bash`);
    expect(stdout).toContain('_complete_claude_antislop');
  });

  test('should handle missing query', async () => {
    try {
      await execSync(`${CLI} scan`, { shell: true });
    } catch (err) {
      expect(err.message).toContain('Repository');
    }
  });
});
