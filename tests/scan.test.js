import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import { join } from 'path';
import { scan } from '../cli/lib/scan.mjs';

const TEST_REPO = join(process.cwd(), 'test-repo');

beforeEach(async () => {
  await fs.ensureDir(TEST_REPO);
  await fs.writeFile(join(TEST_REPO, 'test.ts'), 'const x = 1;\nconst y = 2;\n'.repeat(30));
});

afterEach(async () => {
  await fs.remove(TEST_REPO);
});

describe('Scan Command', () => {
  it('should scan repository', async () => {
    const result = await scan({ repo: TEST_REPO });
    expect(result.success).toBe(true);
    expect(result.data.templates.length).toBeGreaterThanOrEqual(0);
  });

  it('should scan with custom output', async () => {
    const output = join(process.cwd(), 'test-output');
    const result = await scan({ repo: TEST_REPO, output });
    expect(result.success).toBe(true);
    expect(result.data.output).toBe(output);
    await fs.remove(output);
  });
});
