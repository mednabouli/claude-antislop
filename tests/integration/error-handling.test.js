import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const CLI = 'node cli/index.mjs';

describe('Error Handling Integration', () => {
  test('should return error for unsupported shell', async () => {
    try {
      await execAsync(`${CLI} completion invalidshell`);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain('Unsupported shell');
    }
  });

  test('should handle missing memory gracefully', async () => {
    try {
      await execAsync(`${CLI} memory-search test`);
    } catch (error) {
      expect(error.message).toMatch(/Query required|Error/);
    }
  });
});
