import { describe, it, expect } from '@jest/globals';
import { watchDirectory } from '../cli/lib/watch.mjs';

describe('Watch Command', () => {
  it('should start watch mode', async () => {
    const watcher = await watchDirectory({ repo: process.cwd(), quiet: true });
    expect(watcher).toBeDefined();
    watcher.close();
  });
});
