import { describe, it, expect } from '@jest/globals';
import { showStatus } from '../cli/lib/status.mjs';

describe('Status Command', () => {
  it('should return active status', async () => {
    const result = await showStatus({ verbose: false });
    expect(result.success).toBe(true);
    expect(result.data.active).toBe(true);
  });

  it('should return verbose status', async () => {
    const result = await showStatus({ verbose: true });
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('config');
    expect(result.data).toHaveProperty('memory');
  });
});
