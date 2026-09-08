import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import { join } from 'path';

const execFileAsync = promisify(execFile);
const CLI_PATH = join(process.cwd(), 'cli', 'index.mjs');
const TEST_HOME = join(process.cwd(), 'test-integration-home');

beforeEach(async () => {
  await fs.ensureDir(TEST_HOME);
  process.env.HOME = TEST_HOME;
});

afterEach(async () => {
  await fs.remove(TEST_HOME);
});

describe('CLI Integration Tests', () => {
  it('should show help', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, '--help']);
    expect(stdout).toContain('claude-antislop');
    expect(stdout).toContain('Commands:');
  });

  it('should show version', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, '--version']);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  it('should initialize memory', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'init-memory']);
    expect(stdout).toContain('Memory initialized');
    const memoryExists = await fs.pathExists(join(TEST_HOME, '.claude-antislop', 'memory'));
    expect(memoryExists).toBe(true);
  });

  it('should show status', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'status']);
    expect(stdout).toContain('Plugin active');
  });

  it('should show status with JSON', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'status', '--json']);
    const result = JSON.parse(stdout);
    expect(result.success).toBe(true);
    expect(result.data.active).toBe(true);
  });

  it('should scan repository', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'scan', '--repo', process.cwd(), '--json']);
    const result = JSON.parse(stdout);
    expect(result.success).toBe(true);
  });

  it('should search memory', async () => {
    await execFileAsync('node', [CLI_PATH, 'init-memory']);
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'memory-search', '--query', 'test', '--json']);
    const result = JSON.parse(stdout);
    expect(result.success).toBe(true);
  });

  it('should write to memory', async () => {
    await execFileAsync('node', [CLI_PATH, 'init-memory']);
    const { stdout } = await execFileAsync('node', [
      CLI_PATH,
      'memory-write',
      '--category', 'standards',
      '--filename', 'test.md',
      '--content', '# Test Standard'
    ]);
    expect(stdout).toContain('Memory written');
  });

  it('should run code quality check', async () => {
    const { stdout } = await execFileAsync('node', [
      CLI_PATH,
      'code-quality-check',
      '--code', 'const x = 1;',
      '--language', 'typescript',
      '--json'
    ]);
    const result = JSON.parse(stdout);
    expect(result.success).toBe(true);
  });

  it('should list templates', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'templates', 'list']);
    expect(stdout).toContain('Available Templates');
  });

  it('should install templates', async () => {
    await execFileAsync('node', [CLI_PATH, 'init-memory']);
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'templates', 'install', 'nextjs']);
    expect(stdout).toContain('Installed');
  });

  it('should show completion script', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'completion', 'bash']);
    expect(stdout).toContain('_claude_antislop');
  });

  it('should handle invalid command', async () => {
    try {
      await execFileAsync('node', [CLI_PATH, 'invalid-command']);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toContain('invalid-command');
    }
  });

  it('should handle missing required options', async () => {
    try {
      await execFileAsync('node', [CLI_PATH, 'memory-write']);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error.message).toContain('Missing required options');
    }
  });

  it('should support locale option', async () => {
    await execFileAsync('node', [CLI_PATH, 'init-memory']);
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'status', '--locale', 'fr']);
    expect(stdout).toContain('active');
  });

  it('should support quiet mode', async () => {
    const { stdout } = await execFileAsync('node', [CLI_PATH, 'status', '--quiet']);
    expect(stdout.trim()).toBe('');
  });

  it('should support JSON output for all commands', async () => {
    const commands = [
      ['status', '--json'],
      ['scan', '--repo', process.cwd(), '--json'],
      ['memory-search', '--query', 'test', '--json'],
      ['templates', 'list', '--json']
    ];

    for (const args of commands) {
      const { stdout } = await execFileAsync('node', [CLI_PATH, ...args]);
      const result = JSON.parse(stdout);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
    }
  });
});
