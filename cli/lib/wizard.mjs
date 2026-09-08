import { ui } from './ui.mjs';

export async function firstRunWizard() {
  ui.divider();
  ui.heading('👋 Welcome to Claude Antislop!');
  ui.divider();

  ui.step(1, 'Initializing memory system...');
  const { initMemory } = await import('./memory.mjs');
  const initResult = await initMemory({ force: true });
  
  if (initResult.success) {
    ui.success('Memory initialized');
  } else {
    ui.error('Memory initialization failed');
    return false;
  }

  ui.step(2, 'Creating default templates...');
  const { installTemplates } = await import('./templates.mjs');
  try {
    await installTemplates(['nextjs/components', 'react/utils']);
    ui.success('Templates installed');
  } catch (err) {
    ui.error('Template installation failed');
    return false;
  }

  ui.step(3, 'Setting up configuration...');
  const { mkdirSync, writeFileSync } = await import('fs');
  const { join } = await import('path');
  
  const configDir = join(process.env.HOME || '', '.claude-antislop');
  mkdirSync(configDir, { recursive: true });
  
  const config = {
    version: '1.0.0',
    locale: 'en',
    memory: { enabled: true },
    templates: { autoInstall: true },
    quality: { threshold: 80 }
  };
  
  writeFileSync(join(configDir, 'config.json'), JSON.stringify(config, null, 2));
  ui.success('Configuration saved');

  ui.step(4, 'Running initial scan...');
  const { scan } = await import('./scan.mjs');
  try {
    await scan(process.cwd());
    ui.success('Scan complete');
  } catch (err) {
    ui.info('Scan skipped (no repository)');
  }

  ui.divider();
  ui.success('Setup complete!');
  ui.info('Run `claude-antislop --help` for available commands');
  ui.divider();

  return true;
}
