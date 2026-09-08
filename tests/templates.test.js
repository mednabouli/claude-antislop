import { describe, it, expect } from '@jest/globals';
import { listTemplates, installTemplates, previewTemplate, getAvailableStacks } from '../cli/lib/templates.mjs';

describe('Templates Commands', () => {
  it('should list available stacks', () => {
    const stacks = getAvailableStacks();
    expect(stacks).toContain('nextjs');
    expect(stacks).toContain('vue');
    expect(stacks).toContain('python');
  });

  it('should list templates', async () => {
    const result = await listTemplates({ json: true });
    expect(result.success).toBe(true);
    expect(result.data.count).toBeGreaterThanOrEqual(0);
  });

  it('should install templates', async () => {
    const result = await installTemplates('nextjs', { json: true });
    expect(result.success).toBe(true);
    expect(result.data.installed.length).toBeGreaterThan(0);
  });

  it('should preview template', async () => {
    const result = await previewTemplate('nextjs/standards/react-components', { json: true });
    expect(result.success).toBe(true);
    expect(result.data.content).toContain('React Components');
  });
});
