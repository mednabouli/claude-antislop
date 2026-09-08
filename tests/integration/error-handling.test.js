import { describe, it, expect } from '@jest/globals';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CLI_PATH = 'node cli/index.mjs';

describe('Error Handling Integration', () => {
  it('should return error for unsupported shell', async () => {
    try {
      await execFileAsync('node', ['cli/index.mjs', 'completion', 'invalid-shell']);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain('Unsupported shell');
    }
  });

  it('should return error for unsupported locale', async () => {
    try {
      await execFileAsync('node', ['cli/index.mjs', 'status', '--locale', 'invalid']);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain('Unsupported locale');
    }
  });

  it('should return error for missing memory', async () => {
    try {
      await execFileAsync('node', ['cli/index.mjs', 'memory-search', '--query', 'test']);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain('Memory directory not found');
    }
  });

  it('should return error for invalid template path', async () => {
    try {
      await execFileAsync('node', ['cli/index.mjs', 'templates', 'preview', 'invalid/path']);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain('Template not found');
    }
  });

  it('should return error for missing code in quality check', async () => {
    try {
      await execFileAsync('node', ['cli/index.mjs', 'code-quality-check']);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain('No code provided');
    }
  });
});
