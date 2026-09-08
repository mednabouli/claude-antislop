import fs from 'fs-extra';
import { join } from 'path';
import { ui } from './ui.mjs';
import { collectMemory } from './sync.mjs';

const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const MEMORY_DIR = join(HOME_DIR, '.claude-antislop', 'memory');
const DRIVE_DIR = join(HOME_DIR, 'Google Drive', 'Claude Anti-Slop');

export async function syncToDrive(options = {}) {
  const { auto = false } = options;
  
  if (!await fs.pathExists(DRIVE_DIR)) {
    if (auto) return { success: false, message: 'Google Drive not configured', data: { path: DRIVE_DIR } };
    await fs.ensureDir(DRIVE_DIR);
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(DRIVE_DIR, `sync-${timestamp}.json`);
  const memory = await collectMemory();
  
  await fs.writeJson(backupPath, { timestamp, memory }, { spaces: 2 });
  
  ui.success('Synced to Google Drive');
  ui.info(`Location: ${backupPath}`);
  
  return { success: true, message: 'Synced to Google Drive', data: { path: backupPath, timestamp, categories: Object.keys(memory) } };
}

export async function syncFromDrive(backupPath, options = {}) {
  const { force = false } = options;
  
  if (!await fs.pathExists(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }
  
  if (!force && await fs.pathExists(MEMORY_DIR)) {
    const files = await fs.readdir(MEMORY_DIR);
    if (files.length > 0) {
      throw new Error('Memory directory already exists. Use --force to overwrite.');
    }
  }
  
  const backup = await fs.readJson(backupPath);
  await fs.ensureDir(MEMORY_DIR);
  
  for (const [category, items] of Object.entries(backup.memory)) {
    const categoryDir = join(MEMORY_DIR, category);
    await fs.ensureDir(categoryDir);
    
    for (const [filename, content] of Object.entries(items)) {
      await fs.writeFile(join(categoryDir, filename), content);
    }
  }
  
  ui.success('Synced from Google Drive');
  ui.info(`From: ${backupPath}`);
  
  return { success: true, message: 'Synced from Google Drive', data: { path: backupPath, timestamp: backup.timestamp } };
}

export async function listSyncBackups(options = {}) {
  const backups = [];
  
  if (await fs.pathExists(DRIVE_DIR)) {
    const files = await fs.readdir(DRIVE_DIR);
    for (const file of files) {
      if (file.endsWith('.json') && file.startsWith('sync-')) {
        const stat = await fs.stat(join(DRIVE_DIR, file));
        backups.push({ 
          name: file, 
          size: stat.size, 
          modified: stat.mtime,
          location: 'drive' 
        });
      }
    }
  }
  
  backups.sort((a, b) => b.modified.getTime() - a.modified.getTime());
  
  return { success: true, message: 'Sync backups listed', data: { backups, count: backups.length } };
}

export async function enableAutoSync(options = {}) {
  const configPath = join(HOME_DIR, '.claude-antislop', 'config.json');
  let config = {};
  
  try { config = await fs.readJson(configPath); } catch {}
  
  config.features = config.features || {};
  config.features.autoSync = true;
  config.features.syncPath = DRIVE_DIR;
  
  await fs.ensureDir(join(HOME_DIR, '.claude-antislop'));
  await fs.writeJson(configPath, config, { spaces: 2 });
  
  ui.success('Auto-sync enabled');
  ui.info(`Sync path: ${DRIVE_DIR}`);
  
  return { success: true, message: 'Auto-sync enabled', data: { path: DRIVE_DIR } };
}

export async function disableAutoSync(options = {}) {
  const configPath = join(HOME_DIR, '.claude-antislop', 'config.json');
  let config = {};
  
  try { config = await fs.readJson(configPath); } catch {}
  
  if (config.features) {
    config.features.autoSync = false;
    await fs.writeJson(configPath, config, { spaces: 2 });
  }
  
  ui.success('Auto-sync disabled');
  
  return { success: true, message: 'Auto-sync disabled' };
}

export function getSyncPath() {
  return DRIVE_DIR;
}

export async function isSyncEnabled() {
  const configPath = join(HOME_DIR, '.claude-antislop', 'config.json');
  try {
    const config = await fs.readJson(configPath);
    return config.features?.autoSync === true;
  } catch {
    return false;
  }
}
