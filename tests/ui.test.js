import { describe, it, expect } from '@jest/globals';
import { ui } from '../cli/lib/ui.mjs';

describe('UI Utilities', () => {
  it('should have all UI methods', () => {
    expect(ui.divider).toBeDefined();
    expect(ui.heading).toBeDefined();
    expect(ui.success).toBeDefined();
    expect(ui.error).toBeDefined();
    expect(ui.info).toBeDefined();
    expect(ui.warning).toBeDefined();
    expect(ui.step).toBeDefined();
  });

  it('should call methods without error', () => {
    expect(() => ui.divider()).not.toThrow();
    expect(() => ui.heading('Test')).not.toThrow();
    expect(() => ui.success('Test')).not.toThrow();
    expect(() => ui.error('Test')).not.toThrow();
    expect(() => ui.info('Test')).not.toThrow();
  });
});
