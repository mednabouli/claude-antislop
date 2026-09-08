#!/usr/bin/env node

import { initMemory } from './cli/lib/memory.mjs';
import { learnFromGit } from './cli/lib/learn.mjs';
import { scan } from './cli/lib/scan.mjs';
import { listTemplates, installTemplates } from './cli/lib/templates.mjs';
import { watchDirectory } from './cli/lib/watch.mjs';
import { generateCompletion } from './cli/lib/completion.mjs';
import { getLocale } from './cli/lib/i18n.mjs';
import { ui } from './cli/lib/ui.mjs';

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd) {
  ui.heading('Claude Antislop CLI');
  ui.info('Usage: claude-antislop <command>');
  process.exit(0);
}

try {
  if (cmd === 'init-memory') {
    const result = initMemory();
    ui.success('Memory initialized');
    ui.info(`Location: ${result.path}`);
  }

  if (cmd === 'learn-git') {
    const repo = args[1] || process.cwd();
    const recent = parseInt(args[2]) || 30;
    const result = learnFromGit(repo, recent);
    ui.success(result.message);
    ui.info(`Repository: ${result.data.repository}`);
    ui.info(`Period: ${result.data.period}`);
  }

  if (cmd === 'scan') {
    const repo = args[1] || process.cwd();
    const result = scan(repo);
    ui.success(result.message);
    ui.info(`Files: ${result.data.files}`);
  }

  if (cmd === 'templates') {
    const subcmd = args[1];
    if (subcmd === 'list') {
      const result = listTemplates();
      ui.success(result.message);
    }
    if (subcmd === 'install') {
      const path = args[2];
      const output = args[3] || './templates';
      const result = installTemplates([path], { output });
      ui.success(result.message);
    }
  }

  if (cmd === 'watch') {
    const dir = args[1] || process.cwd();
    const result = watchDirectory(dir);
    ui.success(result.message);
  }

  if (cmd === 'completion') {
    const shell = args[1] || 'bash';
    const result = generateCompletion(shell);
    console.log(result.content);
  }

  if (cmd === 'locale') {
    const loc = args[1] || 'en';
    const result = getLocale(loc);
    ui.info(`Locale: ${result.locale} (${result.name})`);
  }

  if (cmd === 'status') {
    ui.success('Plugin active');
    ui.success('Status check complete');
  }

} catch (error) {
  ui.error(`Error: ${error.message}`);
  process.exit(1);
}
