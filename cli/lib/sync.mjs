import fs from 'fs-extra';
import { join } from 'path';
import { ui } from './ui.mjs';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const MEMORY_DIR = join(HOME_DIR, '.claude-antislop', 'memory');
const BACKUP_DIR = join(HOME_DIR, '.claude-antislop', 'backups');
const DRIVE_DIR = join(HOME_DIR, 'Google Drive', 'Claude Anti-Slop');
export async function exportMemory(outputPath, options = {}) {
  const { json = false, quiet = false } = options;
  if (!await fs.pathExists(MEMORY_DIR)) throw new Error('Memory directory not found. Run `claude-antislop init-memory` first.');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = outputPath || join(BACKUP_DIR, `memory-${timestamp}.zip`);
  await fs.ensureDir(BACKUP_DIR);
  const files = await fs.readdir(MEMORY_DIR, { withFileTypes: true });
  const manifest = { exportedAt: timestamp, files: [] };
  for (const file of files) {
    if (file.isDirectory()) {
      const subFiles = await fs.readdir(join(MEMORY_DIR, file.name));
      for (const subFile of subFiles) manifest.files.push(`${file.name}/${subFile}`);
    } else { manifest.files.push(file.name); }
  }
  await fs.writeJson(join(BACKUP_DIR, 'manifest.json'), manifest, { spaces: 2 });
  ui.success('Memory exported'); ui.info(`Location: ${dest}`);
  return { success: true, message: 'Memory exported', data: { path: dest, files: manifest.files.length, timestamp } };
}
export async function importMemory(inputPath, options = {}) {
  const { force = false, json = false } = options;
  if (!await fs.pathExists(inputPath)) throw new Error(`Import file not found: ${inputPath}`);
  if (!force && await fs.pathExists(MEMORY_DIR)) {
    const files = await fs.readdir(MEMORY_DIR);
    if (files.length > 0) throw new Error('Memory directory already exists. Use --force to overwrite.');
  }
  await fs.ensureDir(MEMORY_DIR);
  ui.success('Memory imported'); ui.info(`From: ${inputPath}`);
  return { success: true, message: 'Memory imported', data: { path: inputPath } };
}
export async function backupToDrive(options = {}) {
  const { auto = false } = options;
  if (!await fs.pathExists(DRIVE_DIR)) {
    if (auto) return { success: false, message: 'Google Drive not configured', data: { path: DRIVE_DIR } };
    await fs.ensureDir(DRIVE_DIR);
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(DRIVE_DIR, `backup-${timestamp}.json`);
  const memory = await collectMemory();
  await fs.writeJson(backupPath, { timestamp, memory }, { spaces: 2 });
  ui.success('Backup saved to Google Drive'); ui.info(`Location: ${backupPath}`);
  return { success: true, message: 'Backup saved', data: { path: backupPath, timestamp } };
}
export async function restoreFromDrive(backupPath, options = {}) {
  const { force = false } = options;
  if (!await fs.pathExists(backupPath)) throw new Error(`Backup file not found: ${backupPath}`);
  if (!force && await fs.pathExists(MEMORY_DIR)) {
    const files = await fs.readdir(MEMORY_DIR);
    if (files.length > 0) throw new Error('Memory directory already exists. Use --force to overwrite.');
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
  ui.success('Memory restored from backup'); ui.info(`From: ${backupPath}`);
  return { success: true, message: 'Memory restored', data: { path: backupPath, timestamp: backup.timestamp } };
}
export async function listBackups(options = {}) {
  const backups = [];
  if (await fs.pathExists(BACKUP_DIR)) {
    const files = await fs.readdir(BACKUP_DIR);
    for (const file of files) {
      if (file.endsWith('.zip') || file.endsWith('.json')) {
        const stat = await fs.stat(join(BACKUP_DIR, file));
        backups.push({ name: file, size: stat.size, modified: stat.mtime });
      }
    }
  }
  if (await fs.pathExists(DRIVE_DIR)) {
    const files = await fs.readdir(DRIVE_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const stat = await fs.stat(join(DRIVE_DIR, file));
        backups.push({ name: file, size: stat.size, modified: stat.mtime, location: 'drive' });
      }
    }
  }
  backups.sort((a, b) => b.modified.getTime() - a.modified.getTime());
  return { success: true, message: 'Backups listed', data: { backups, count: backups.length } };
}
export async function collectMemory() {
  const memory = {};
  if (!await fs.pathExists(MEMORY_DIR)) return memory;
  const categories = await fs.readdir(MEMORY_DIR, { withFileTypes: true });
  for (const category of categories) {
    if (category.isDirectory()) {
      memory[category.name] = {};
      const files = await fs.readdir(join(MEMORY_DIR, category.name));
      for (const file of files) {
        const content = await fs.readFile(join(MEMORY_DIR, category.name, file), 'utf-8');
        memory[category.name][file] = content;
      }
    }
  }
  return memory;
}
export async function autoBackup() {
  const configPath = join(HOME_DIR, '.claude-antislop', 'config.json');
  let config = {};
  try { config = await fs.readJson(configPath); } catch {}
  if (!config.features?.autoBackup) return;
  await backupToDrive({ auto: true });
}
