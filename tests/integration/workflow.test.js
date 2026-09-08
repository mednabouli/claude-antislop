import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const CLI = 'node cli/index.mjs';

describe('Complete Workflows', () => {
  test('should complete init-memory workflow', async () => {
    const { stdout } = await execAsync(`${CLI} init-memory`);
    expect(stdout).toContain('Memory initialized');
  });

  test('should complete scan workflow', async () => {
    const { stdout } = await execAsync(`${CLI} scan`);
    expect(stdout).toContain('Scan completed');
  });

  test('should complete status workflow', async () => {
    const { stdout } = await execAsync(`${CLI} status`);
    expect(stdout).toContain('Plugin active');
  });

  test('should complete templates list workflow', async () => {
    const { stdout } = await execAsync(`${CLI} templates list`);
    expect(stdout).toContain('Templates');
  });

  test('should complete completion workflow', async () => {
    const { stdout } = await execAsync(`${CLI} completion bash`);
    expect(stdout).toContain('complete');
  });
});
