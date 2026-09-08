import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const CLI = 'node cli/index.mjs';

describe('CLI Integration Tests', () => {
  test('should show help', async () => {
    const { stdout } = await execAsync(CLI);
    expect(stdout).toContain('Usage');
  });

  test('should initialize memory', async () => {
    const { stdout } = await execAsync(`${CLI} init-memory`);
    expect(stdout).toContain('Memory initialized');
  });

  test('should show status', async () => {
    const { stdout } = await execAsync(`${CLI} status`);
    expect(stdout).toContain('Plugin active');
  });

  test('should scan repository', async () => {
    const { stdout } = await execAsync(`${CLI} scan`);
    expect(stdout).toContain('Scan completed');
  });

  test('should list templates', async () => {
    const { stdout } = await execAsync(`${CLI} templates list`);
    expect(stdout).toContain('Templates');
  });

  test('should show completion script', async () => {
    const { stdout } = await execAsync(`${CLI} completion bash`);
    expect(stdout).toContain('complete');
  });

  test('should handle missing query', async () => {
    try {
      await execAsync(`${CLI} memory-search`);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain('Query required');
    }
  });
});
