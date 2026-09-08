import { describe, it, expect } from '@jest/globals';
import { learn } from '../cli/lib/learn.mjs';

describe('Learn Command', () => {
  it('should learn from git history', async () => {
    const result = await learn({ repo: process.cwd(), recent: '30d' });
    expect(result.success).toBe(true);
    expect(result.data.repo).toBe(process.cwd());
    expect(result.data.period).toBe('30d');
  });

  it('should learn with custom period', async () => {
    const result = await learn({ repo: process.cwd(), recent: '7d' });
    expect(result.success).toBe(true);
    expect(result.data.period).toBe('7d');
  });
});
