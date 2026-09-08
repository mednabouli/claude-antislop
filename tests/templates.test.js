import { installTemplates, listTemplates, previewTemplate } from '../cli/lib/templates.mjs';

describe('Templates Commands', () => {
  it('should list templates', async () => {
    const result = await listTemplates({});
    expect(result.success).toBe(true);
    expect(result.data.count).toBeGreaterThanOrEqual(1);
  });

  it('should list templates by stack', async () => {
    const result = await listTemplates({ stack: 'react' });
    expect(result.success).toBe(true);
  });

  it('should install templates', async () => {
    const result = await installTemplates(['nextjs/components', 'react/utils']);
    expect(result.success).toBe(true);
    expect(result.data.installed).toHaveLength(2);
  });

  it('should preview template', async () => {
    const result = await previewTemplate('nextjs/components/Button');
    expect(result.success).toBe(true);
    expect(result.data.content).toBeDefined();
  });
});
