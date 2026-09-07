#!/usr/bin/env node

/**
 * Install command with polished UI
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import { ui, formatDuration } from './ui.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const INSTALL_DIR = join(HOME_DIR, '.claude-antislop');
const CLAUDE_PLUGIN_DIR = join(HOME_DIR, '.claude', 'plugins');

export async function install(options = {}) {
  const { initMemory = false, verbose = false } = options;

  const startTime = Date.now();
  ui.divider();
  ui.heading('Installing Claude Anti-Slop');
  ui.divider();

  try {
    const spinner = ui.spinner('Creating install directory...');
    if (!verbose) spinner.start();
    await fs.ensureDir(INSTALL_DIR);
    if (!verbose) spinner.succeed('Install directory created');
    else ui.success('Install directory created');

    if (!verbose) spinner.start('Copying plugin files...');
    const pluginSource = join(__dirname, '..', '..', 'plugin');
    const pluginDest = join(INSTALL_DIR, 'plugin');

    if (await fs.pathExists(pluginSource)) {
      await fs.copy(pluginSource, pluginDest, { overwrite: true });
      if (!verbose) spinner.succeed('Plugin files copied');
      else ui.success('Plugin files copied');
    } else {
      await fs.ensureDir(pluginDest);
      if (!verbose) spinner.succeed('Plugin directory created');
      else ui.success('Plugin directory created');
    }

    if (!verbose) spinner.start('Creating default config...');
    const configPath = join(INSTALL_DIR, 'config.json');
    if (!await fs.pathExists(configPath)) {
      const defaultConfig = {
        defaultStack: ['nextjs', 'typescript', 'supabase', 'drizzle'],
        locales: ['en', 'fr'],
        features: {
          learnFromGit: false,
          autoUpdateMemory: false,
          reviewMode: true
        }
      };
      await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
      if (!verbose) spinner.succeed('Default config created');
      else ui.success('Default config created');
    } else {
      if (!verbose) spinner.succeed('Existing config preserved');
      else ui.success('Existing config preserved');
    }

    if (!verbose) spinner.start('Registering with Claude Code...');
    try {
      await registerWithClaudeCode(pluginDest);
      if (!verbose) spinner.succeed('Registered with Claude Code');
      else ui.success('Registered with Claude Code');
    } catch (error) {
      if (!verbose) spinner.warn('Claude Code registration skipped');
      ui.warning('Manual registration may be required');
    }

    if (initMemory) {
      if (!verbose) spinner.start('Initializing memory...');
      try {
        const { initMemory: initMemoryFn } = await import('./memory.mjs');
        await initMemoryFn({ force: false, verbose });
        if (!verbose) spinner.succeed('Memory initialized');
        else ui.success('Memory initialized');
      } catch (error) {
        if (!verbose) spinner.warn('Memory initialization skipped');
        ui.warning('Run "claude-antislop init-memory" manually');
      }
    }

    const duration = formatDuration(Date.now() - startTime);
    ui.divider();
    ui.success(`Installation complete in ${duration}`);
    ui.divider();

    ui.info('Location: ~/.claude-antislop/');
    ui.info('Run "claude-antislop status" to verify');
    ui.info('Run "claude-antislop scan" to personalize');

    if (!initMemory) {
      console.log();
      ui.info('Tip: Run with --init-memory to initialize memory');
    }

  } catch (error) {
    ui.divider();
    ui.error('Installation failed');
    ui.error(error.message);
    if (verbose) console.error(error.stack);
    ui.info('See TROUBLESHOOTING.md for help');
    throw error;
  }
}

async function registerWithClaudeCode(pluginPath, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      try {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        await execAsync(`claude plugin add "${pluginPath}"`, { timeout: 5000 });
        return;
      } catch {}
      try {
        await fs.ensureDir(CLAUDE_PLUGIN_DIR);
        const linkPath = join(CLAUDE_PLUGIN_DIR, 'claude-antislop');
        if (await fs.pathExists(linkPath)) await fs.remove(linkPath);
        await fs.symlink(pluginPath, linkPath, 'dir');
        return;
      } catch {}
      try {
        await fs.ensureDir(CLAUDE_PLUGIN_DIR);
        const destPath = join(CLAUDE_PLUGIN_DIR, 'claude-antislop');
        if (await fs.pathExists(destPath)) await fs.remove(destPath);
        await fs.copy(pluginPath, destPath);
        return;
      } catch {}
      throw new Error('All registration methods failed');
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) await sleep(Math.pow(2, attempt) * 100);
    }
  }
  throw lastError;
}

export async function isInstalled() {
  return await fs.pathExists(INSTALL_DIR);
}

export async function getInstallInfo() {
  const installed = await isInstalled();
  if (!installed) return { installed: false, version: null, location: INSTALL_DIR };
  const pluginJsonPath = join(INSTALL_DIR, 'plugin', 'plugin.json');
  let version = null;
  if (await fs.pathExists(pluginJsonPath)) {
    const pluginJson = await fs.readJson(pluginJsonPath);
    version = pluginJson.version;
  }
  return { installed: true, version, location: INSTALL_DIR, hasMemory: await fs.pathExists(join(INSTALL_DIR, 'memory')), hasConfig: await fs.pathExists(join(INSTALL_DIR, 'config.json')) };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
