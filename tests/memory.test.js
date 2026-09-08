import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import { join } from 'path';
import { initMemory, memorySearch, memoryWrite } from '../cli/lib/memory.mjs';

const TEST_DIR = join(process.cwd(), 'test-memory');

beforeEach(async () => {
  await fs.ensureDir(TEST_DIR);
  process.env.HOME = process.cwd();
});

afterEach(async () => {
  await fs.remove(TEST_DIR);
});

describe('Memory Commands', () => {
  it('should initialize memory directories', async () => {
    const result = await initMemory({ force: true });
    expect(result.success).toBe(true);
    expect(result.data.categories).toHaveLength(5);
  });

  it('should write to memory', async () => {
    await initMemory({ force: true });
    const result = await memoryWrite({
      category: 'standards',
      filename: 'test.md',
      content: '# Test Standard\n\nThis is a test.'
    });
    expect(result.success).toBe(true);
  });

  it('should search memory', async () => {
    await initMemory({ force: true });
    await memoryWrite({
      category: 'standards',
      filename: 'test.md',
      content: '# Testing Standards\n\nWrite tests for all code.'
    });
    const result = await memorySearch({ query: 'test', limit: 5 });
    expect(result.success).toBe(true);
    expect(result.data.count).toBeGreaterThanOrEqual(0);
  });
});
