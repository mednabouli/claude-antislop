#!/usr/bin/env node

/**
 * Claude Anti-Slop CLI
 * 
 * Local-first, per-developer quality layer that never touches your repo config.
 */

import { Command } from 'commander';
import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ui } from './lib/ui.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { version, description } = JSON.parse(
  await fs.readFile(join(__dirname, '..', 'package.json'), 'utf-8')
);

const program = new Command();

program
  .name('claude-antislop')
  .version(version)
  .description(description)
  .showHelpAfterError();

program
  .command('install')
  .description('Install the plugin with optional memory initialization')
  .option('--init-memory', 'Initialize memory directory')
  .option('--verbose', 'Show detailed output')
  .action(async (options) => {
    try {
      const { install } = await import('./lib/install.mjs');
      await install(options);
    } catch (error) {
      ui.error('Installation failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show plugin status and diagnostics')
  .option('--verbose', 'Show detailed diagnostics')
  .action(async (options) => {
    try {
      const { showStatus } = await import('./lib/status.mjs');
      await showStatus(options);
    } catch (error) {
      ui.error('Status check failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('scan')
  .description('Scan a repository and generate templates')
  .option('--repo <path>', 'Repository path (default: current directory)')
  .option('--output <path>', 'Output directory')
  .option('--verbose', 'Show detailed output')
  .action(async (options) => {
    try {
      const { scan } = await import('./lib/scan.mjs');
      await scan(options);
    } catch (error) {
      ui.error('Scan failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('learn-from-git')
  .description('Learn from git history and extract patterns')
  .option('--repo <path>', 'Repository path (default: current directory)')
  .option('--recent <period>', 'Time period (e.g., 30d, 3m, 1y)', '30d')
  .option('--verbose', 'Show detailed output')
  .action(async (options) => {
    try {
      const { learn } = await import('./lib/learn.mjs');
      await learn(options);
    } catch (error) {
      ui.error('Learning failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('memory-search')
  .description('Search memory with fuzzy matching')
  .option('--query <text>', 'Search query')
  .option('--category <name>', 'Category filter', 'all')
  .option('--limit <number>', 'Maximum results', '5')
  .option('--fuzzy', 'Use fuzzy matching', true)
  .action(async (options) => {
    try {
      const { memorySearch } = await import('./lib/memory.mjs');
      const result = await memorySearch(options);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      ui.error('Memory search failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('memory-write')
  .description('Write to memory with append/create modes')
  .option('--category <name>', 'Category', 'standards')
  .option('--filename <name>', 'Filename')
  .option('--content <text>', 'Content to write')
  .option('--append', 'Append to existing file')
  .action(async (options) => {
    try {
      const { memoryWrite } = await import('./lib/memory.mjs');
      const result = await memoryWrite(options);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      ui.error('Memory write failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('code-quality-check')
  .description('Run ESLint, TypeScript, and Prettier checks')
  .option('--code <code>', 'Code to check')
  .option('--language <lang>', 'Language', 'typescript')
  .option('--checks <types>', 'Checks to run', 'lint,typecheck,prettier')
  .action(async (options) => {
    try {
      const { codeQualityCheck } = await import('./lib/quality.mjs');
      const checks = options.checks.split(',');
      const result = await codeQualityCheck({ code: options.code, language: options.language, checks });
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      ui.error('Quality check failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('mcp-server')
  .description('Start MCP server for Claude Code integration')
  .action(async () => {
    try {
      const { startServer } = await import('../mcp/mcp-server-index.mjs');
      await startServer();
    } catch (error) {
      ui.error('MCP server failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program
  .command('init-memory')
  .description('Initialize memory directory with categories')
  .option('--force', 'Overwrite existing memory')
  .option('--verbose', 'Show detailed output')
  .action(async (options) => {
    try {
      const { initMemory } = await import('./lib/memory.mjs');
      await initMemory(options);
    } catch (error) {
      ui.error('Memory initialization failed');
      ui.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
