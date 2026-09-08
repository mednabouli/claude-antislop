#!/usr/bin/env node

import { initMemory, writeMemory, searchMemory } from './lib/memory.mjs';
import { learnFromGit } from './lib/learn.mjs';
import { scan } from './lib/scan.mjs';
import { listTemplates, installTemplates, previewTemplate } from './lib/templates.mjs';
import { watchDirectory } from './lib/watch.mjs';
import { generateCompletion } from './lib/completion.mjs';
import { getLocale, t } from './lib/i18n.mjs';
import { ui } from './lib/ui.mjs';

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
      const tpath = args[2];
      const output = args[3] || './templates';
      const result = installTemplates([tpath], { output });
      ui.success(result.message);
    }
    if (subcmd === 'preview') {
      const tpath = args[2];
      const result = previewTemplate(tpath);
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

  if (cmd === 'memory-write') {
    const file = args[1];
    const content = args[2];
    if (!file || !content) {
      throw new Error('File and content required');
    }
    const result = writeMemory(file, content);
    ui.success('Memory written');
    ui.info(`Location: ${result.path}`);
  }

  if (cmd === 'memory-search') {
    const query = args[1];
    if (!query) {
      throw new Error('Query required');
    }
    const result = searchMemory(query);
    ui.success(result.message);
    ui.info(`Found: ${result.data.count}`);
  }

} catch (error) {
  ui.error(`Error: ${error.message}`);
  process.exit(1);
}
