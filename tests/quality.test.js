import { describe, it, expect } from '@jest/globals';
import { codeQualityCheck } from '../cli/lib/quality.mjs';

describe('Code Quality Check', () => {
  it('should pass with clean code', async () => {
    const result = await codeQualityCheck({
      code: 'const x = 1;',
      language: 'typescript',
      checks: ['lint']
    });
    expect(result.success).toBe(true);
    expect(result.data.issues).toHaveLength(0);
  });

  it('should detect var usage', async () => {
    const result = await codeQualityCheck({
      code: 'var x = 1;',
      language: 'javascript',
      checks: ['lint']
    });
    expect(result.success).toBe(false);
    expect(result.data.issues.length).toBeGreaterThan(0);
  });

  it('should detect any type in TypeScript', async () => {
    const result = await codeQualityCheck({
      code: 'const x: any = 1;',
      language: 'typescript',
      checks: ['typecheck']
    });
    expect(result.success).toBe(false);
  });

  it('should detect 4-space indentation', async () => {
    const result = await codeQualityCheck({
      code: '    const x = 1;',
      language: 'typescript',
      checks: ['prettier']
    });
    expect(result.success).toBe(false);
  });
});
