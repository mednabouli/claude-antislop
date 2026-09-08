import fs from 'fs-extra';
import { join } from 'path';
import { ui } from './ui.mjs';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const CONFIG_DIR = join(HOME_DIR, '.claude-antislop');
export async function install(options = {}) {
  const { initMemory = false, verbose = false } = options;
  await fs.ensureDir(CONFIG_DIR);
  const configPath = join(CONFIG_DIR, 'config.json');
  const config = { defaultStack: ['nextjs'], locales: ['en'], features: { learnFromGit: false, autoUpdateMemory: false, reviewMode: true } };
  await fs.writeJson(configPath, config, { spaces: 2 });
  ui.success('Installation complete');
  ui.info(`Config: ${configPath}`);
  if (initMemory) {
    const { initMemory: initMem } = await import('./memory.mjs');
    await initMem({ force: false, verbose });
  }
  return { success: true, message: 'Installation complete', data: { config: configPath } };
}
