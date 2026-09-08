import { describe, expect, test } from '@jest/globals';
import { learn, learnFromGit } from '../cli/lib/learn.mjs';

describe('learn module', () => {
  test('exports learn function', async () => {
    const result = await learn(process.cwd(), { recent: 7 });
    expect(result.success).toBe(true);
  });

  test('learnFromGit validates repo', async () => {
    await expect(learnFromGit('', 30)).rejects.toThrow('Repository path required');
  });

  test('learnFromGit validates recent', async () => {
    await expect(learnFromGit(process.cwd(), -1)).rejects.toThrow('positive number');
  });
});
