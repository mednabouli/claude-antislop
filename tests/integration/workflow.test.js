import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import { join } from 'path';

const execFileAsync = promisify(execFile);
const CLI_PATH = 'node cli/index.mjs';
const TEST_HOME = join(process.cwd(), 'test-workflow-home');

beforeEach(async () => {
  await fs.ensureDir(TEST_HOME);
  process.env.HOME = TEST_HOME;
});

afterEach(async () => {
  await fs.remove(TEST_HOME);
});

describe('Complete Workflows', () => {
  it('should complete full setup workflow', async () => {
    // Initialize
    const { stdout: initStdout } = await execFileAsync('node', ['cli/index.mjs', 'init-memory']);
    expect(initStdout).toContain('Memory initialized');

    // Check status
    const { stdout: statusStdout } = await execFileAsync('node', ['cli/index.mjs', 'status']);
    expect(statusStdout).toContain('Plugin active');

    // Write to memory
    const { stdout: writeStdout } = await execFileAsync('node', [
      'cli/index.mjs',
      'memory-write',
      '--category', 'standards',
      '--filename', 'test.md',
      '--content', '# Test\n\nThis is a test standard.'
    ]);
    expect(writeStdout).toContain('Memory written');

    // Search memory
    const { stdout: searchStdout } = await execFileAsync('node', [
      'cli/index.mjs',
      'memory-search',
      '--query', 'test',
      '--json'
    ]);
    const result = JSON.parse(searchStdout);
    expect(result.success).toBe(true);
    expect(result.data.count).toBeGreaterThanOrEqual(1);
  });

  it('should complete template installation workflow', async () => {
    // Initialize memory
    await execFileAsync('node', ['cli/index.mjs', 'init-memory']);

    // List templates
    const { stdout: listStdout } = await execFileAsync('node', ['cli/index.mjs', 'templates', 'list']);
    expect(listStdout).toContain('Available Templates');

    // Install templates
    const { stdout: installStdout } = await execFileAsync('node', [
      'cli/index.mjs',
      'templates',
      'install',
      'nextjs'
    ]);
    expect(installStdout).toContain('Installed');

    // Search in installed templates
    const { stdout: searchStdout } = await execFileAsync('node', [
      'cli/index.mjs',
      'memory-search',
      '--query', 'react',
      '--json'
    ]);
    const result = JSON.parse(searchStdout);
    expect(result.success).toBe(true);
  });

  it('should complete code quality workflow', async () => {
    // Check clean code
    const { stdout: cleanStdout } = await execFileAsync('node', [
      'cli/index.mjs',
      'code-quality-check',
      '--code', 'const x = 1;',
      '--language', 'typescript',
      '--json'
    ]);
    const cleanResult = JSON.parse(cleanStdout);
    expect(cleanResult.success).toBe(true);

    // Check code with issues
    const { stdout: issueStdout } = await execFileAsync('node', [
      'cli/index.mjs',
      'code-quality-check',
      '--code', 'var x = 1;',
      '--language', 'javascript',
      '--json'
    ]);
    const issueResult = JSON.parse(issueStdout);
    expect(issueResult.success).toBe(false);
    expect(issueResult.data.issues.length).toBeGreaterThan(0);
  });

  it('should complete scan workflow', async () => {
    // Initialize
    await execFileAsync('node', ['cli/index.mjs', 'init-memory']);

    // Scan current repo
    const { stdout: scanStdout } = await execFileAsync('node', [
      'cli/index.mjs',
      'scan',
      '--repo',
      process.cwd(),
      '--json'
    ]);
    const result = JSON.parse(scanStdout);
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('templates');
  });

  it('should complete localization workflow', async () => {
    const locales = ['en', 'fr', 'es', 'de', 'zh', 'ja'];

    for (const locale of locales) {
      const { stdout } = await execFileAsync('node', [
        'cli/index.mjs',
        'status',
        '--locale',
        locale,
        '--json'
      ]);
      const result = JSON.parse(stdout);
      expect(result.success).toBe(true);
    }
  });
});
