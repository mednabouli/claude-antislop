import { describe, expect, test } from '@jest/globals';
import { scan } from '../cli/lib/scan.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testRepo = path.join(__dirname, '..');

describe('scan module', () => {
  test('scans existing repo', async () => {
    const result = await scan(testRepo);
    expect(result.success).toBe(true);
    expect(result.data.files).toBeGreaterThanOrEqual(0);
  });
});
