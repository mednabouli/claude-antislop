#!/usr/bin/env node

/**
 * Status command with polished output
 */

import { join } from 'path';
import fs from 'fs-extra';
import { ui, formatBytes } from './ui.mjs';

const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const INSTALL_DIR = join(HOME_DIR, '.claude-antislop');
const PLUGIN_DIR = join(INSTALL_DIR, 'plugin');
const MEMORY_DIR = join(INSTALL_DIR, 'memory');
const CONFIG_PATH = join(INSTALL_DIR, 'config.json');
const CLAUDE_PLUGIN_DIR = join(HOME_DIR, '.claude', 'plugins', 'claude-antislop');

export async function showStatus(options = {}) {
  const { verbose = false } = options;
  ui.divider();
  ui.heading('Claude Anti-Slop Status');
  ui.divider();

  const installed = await fs.pathExists(INSTALL_DIR);
  if (!installed) {
    ui.error('Plugin is not installed');
    console.log();
    ui.info('Install it with: claude-antislop install --init-memory');
    return;
  }

  const pluginExists = await fs.pathExists(PLUGIN_DIR);
  const memoryExists = await fs.pathExists(MEMORY_DIR);
  const configExists = await fs.pathExists(CONFIG_PATH);
  const claudeLinked = await fs.pathExists(CLAUDE_PLUGIN_DIR);
  const version = await getVersion();

  ui.table([
    [pluginExists ? ui.green('Ready') : ui.red('Missing'), 'Plugin files', version || 'Unknown'],
    [memoryExists ? ui.green('Ready') : ui.yellow('Optional'), 'Personal memory', memoryExists ? await memorySummary() : 'Not initialized'],
    [configExists ? ui.green('Ready') : ui.yellow('Default'), 'Configuration', configExists ? 'Custom/default config loaded' : 'Defaults in use'],
    [claudeLinked ? ui.green('Linked') : ui.yellow('Check'), 'Claude Code integration', claudeLinked ? 'Detected' : 'Manual registration may be required']
  ], ['Status', 'Component', 'Details']);

  if (verbose) {
    console.log();
    ui.heading('Diagnostics');
    ui.keyValue('Install path', INSTALL_DIR);
    ui.keyValue('Plugin path', PLUGIN_DIR);
    ui.keyValue('Memory path', MEMORY_DIR);
    ui.keyValue('Config path', CONFIG_PATH);
    if (configExists) {
      const config = await fs.readJson(CONFIG_PATH);
      ui.keyValue('Stack', config.defaultStack?.join(', ') || 'Not set');
      ui.keyValue('Locales', config.locales?.join(', ') || 'Not set');
      ui.keyValue('Review mode', String(config.features?.reviewMode ?? false));
      ui.keyValue('Git learning', String(config.features?.learnFromGit ?? false));
    }
  }

  console.log();
  ui.divider();
  ui.heading('Suggested next step');
  if (!memoryExists) ui.info('Initialize memory: claude-antislop init-memory');
  else if (!claudeLinked) ui.info('Verify Claude Code plugin registration, then restart Claude Code.');
  else ui.info('Personalize your rules: claude-antislop scan');
  ui.divider();
}

async function getVersion() {
  const pluginJsonPath = join(PLUGIN_DIR, 'plugin.json');
  if (!await fs.pathExists(pluginJsonPath)) return null;
  const pluginJson = await fs.readJson(pluginJsonPath);
  return pluginJson.version;
}

async function memorySummary() {
  const bytes = await getDirectorySize(MEMORY_DIR);
  const entries = await fs.readdir(MEMORY_DIR);
  const directories = entries.filter((entry) => !entry.endsWith('.md')).length;
  return `${formatBytes(bytes)}, ${directories} categories`;
}

async function getDirectorySize(directory) {
  let total = 0;
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) total += await getDirectorySize(entryPath);
    else total += (await fs.stat(entryPath)).size;
  }
  return total;
}
