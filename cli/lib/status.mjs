import fs from 'fs-extra';
import { join } from 'path';
import { ui } from './ui.mjs';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const CONFIG_DIR = join(HOME_DIR, '.claude-antislop');
const MEMORY_DIR = join(CONFIG_DIR, 'memory');
export async function showStatus(options = {}) {
  const { verbose = false } = options;
  const configExists = await fs.pathExists(join(CONFIG_DIR, 'config.json'));
  const memoryExists = await fs.pathExists(MEMORY_DIR);
  ui.success('Plugin active');
  if (verbose) {
    ui.info(`Config: ${configExists ? '✓' : '✗'}`);
    ui.info(`Memory: ${memoryExists ? '✓' : '✗'}`);
  }
  return { success: true, message: 'Plugin active', data: { active: true, config: configExists, memory: memoryExists } };
}
