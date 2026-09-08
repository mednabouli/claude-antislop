import { describe, expect, test } from '@jest/globals';
import { watchDirectory } from '../cli/lib/watch.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.join(__dirname, '..');

describe('Watch Command', () => {
  test('starts watch mode', () => {
    const result = watchDirectory(testDir);
    expect(result.success).toBe(true);
    expect(result.data.dir).toBe(testDir);
  });

  test('validates dir parameter', () => {
    expect(() => watchDirectory({})).toThrow('Directory path required');
  });
});
