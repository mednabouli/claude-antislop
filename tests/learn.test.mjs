import { learn } from '../cli/lib/learn.mjs';
import { describe, it, expect } from '@jest/globals';

describe('learn module', () => {
  it('exports learn function', async () => {
    const result = await learn({ repo: 'test-repo' });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
