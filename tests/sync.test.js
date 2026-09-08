import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import { join } from 'path';
import { exportMemory, listBackups, collectMemory } from '../cli/lib/sync.mjs';

const TEST_HOME = join(process.cwd(), 'test-home');

beforeEach(async () => {
  await fs.ensureDir(TEST_HOME);
  process.env.HOME = TEST_HOME;
  await fs.ensureDir(join(TEST_HOME, '.claude-antislop', 'memory', 'standards'));
  await fs.writeFile(join(TEST_HOME, '.claude-antislop', 'memory', 'standards', 'test.md'), '# Test');
});

afterEach(async () => {
  await fs.remove(TEST_HOME);
});

describe('Sync Commands', () => {
  it('should export memory', async () => {
    const result = await exportMemory({});
    expect(result.success).toBe(true);
    expect(result.data.files).toBeGreaterThanOrEqual(1);
  });

  it('should list backups', async () => {
    const result = await listBackups({});
    expect(result.success).toBe(true);
    expect(result.data.backups).toBeDefined();
  });

  it('should collect memory', async () => {
    const memory = await collectMemory();
    expect(memory).toBeDefined();
    expect(memory.standards).toBeDefined();
  });
});
