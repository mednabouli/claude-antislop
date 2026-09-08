import { scan } from '../cli/lib/scan.mjs';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('Scan Command', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'scan-test-'));
  });

  it('should scan repository', async () => {
    const result = await scan(tempDir);
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it('should scan with custom output', async () => {
    const result = await scan(tempDir, { output: join(tempDir, 'output') });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
});
