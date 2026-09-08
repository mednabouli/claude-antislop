import { describe, expect, test } from '@jest/globals';
import { ui } from '../cli/lib/ui.mjs';

describe('ui module', () => {
  test('exports ui object', () => {
    expect(typeof ui).toBe('object');
  });

  test('has message methods', () => {
    expect(typeof ui.success).toBe('function');
    expect(typeof ui.error).toBe('function');
    expect(typeof ui.info).toBe('function');
  });
});
