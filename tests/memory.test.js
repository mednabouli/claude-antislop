import { initMemory, memoryWrite, memorySearch } from '../cli/lib/memory.mjs';

describe('Memory Commands', () => {
  it('should initialize memory directories', async () => {
    const result = await initMemory({ force: true });
    expect(result.success).toBe(true);
    expect(result.data.categories).toHaveLength(5);
  });

  it('should write to memory', async () => {
    const result = await memoryWrite('test.md', 'Test content');
    expect(result.success).toBe(true);
  });

  it('should search memory', async () => {
    const result = await memorySearch('test', { recent: 7 });
    expect(result.success).toBe(true);
    expect(result.data.query).toBe('test');
  });
});
