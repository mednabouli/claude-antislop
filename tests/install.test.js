import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import { join } from 'path';
import { install } from '../cli/lib/install.mjs';

const TEST_HOME = join(process.cwd(), 'test-home');

beforeEach(async () => {
  await fs.ensureDir(TEST_HOME);
  process.env.HOME = TEST_HOME;
});

afterEach(async () => {
  await fs.remove(TEST_HOME);
});

describe('Install Command', () => {
  it('should install configuration', async () => {
    const result = await install({});
    expect(result.success).toBe(true);
    expect(result.data.config).toContain('.claude-antislop');
  });

  it('should install with memory initialization', async () => {
    const result = await install({ initMemory: true });
    expect(result.success).toBe(true);
  });
});
