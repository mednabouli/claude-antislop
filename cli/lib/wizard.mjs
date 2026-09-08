import { ui } from './ui.mjs';
import { initMemory } from './memory.mjs';
import { installCompletion } from './completion.mjs';
import fs from 'fs-extra';
import { join } from 'path';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const CONFIG_PATH = join(HOME_DIR, '.claude-antislop', 'config.json');
const STACKS = [
  { value: 'nextjs', label: 'Next.js (React + TypeScript)' },
  { value: 'react', label: 'React + TypeScript' },
  { value: 'vue', label: 'Vue 3 + TypeScript' },
  { value: 'svelte', label: 'Svelte + TypeScript' },
  { value: 'node', label: 'Node.js Backend' },
  { value: 'python', label: 'Python Backend' },
  { value: 'custom', label: 'Custom Stack' }
];
const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' }
];
function prompt(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => { resolve(data.toString().trim()); });
  });
}
export async function firstRunWizard() {
  ui.divider(); ui.heading('🚀 Claude Anti-Slop Setup Wizard'); ui.divider(); console.log();
  ui.info("Welcome! Let's set up Claude Anti-Slop for your workflow."); console.log();
  const config = { defaultStack: ['nextjs'], locales: ['en'], features: { learnFromGit: false, autoUpdateMemory: false, reviewMode: true } };
  ui.step(1, 'Select your stack');
  STACKS.forEach((stack, i) => console.log(`  ${i + 1}. ${stack.label}`));
  const stackInput = await prompt('Enter stack number (1-7): ');
  const stackIndex = parseInt(stackInput) - 1;
  if (stackIndex >= 0 && stackIndex < STACKS.length) { config.defaultStack = [STACKS[stackIndex].value]; ui.success(`Selected: ${STACKS[stackIndex].label}`); }
  else { config.defaultStack = ['nextjs']; ui.warning('Invalid selection, using Next.js as default'); }
  console.log();
  ui.step(2, 'Select your locale');
  LOCALES.forEach((locale, i) => console.log(`  ${i + 1}. ${locale.label}`));
  const localeInput = await prompt('Enter locale number (1-6): ');
  const localeIndex = parseInt(localeInput) - 1;
  if (localeIndex >= 0 && localeIndex < LOCALES.length) { config.locales = [LOCALES[localeIndex].value]; ui.success(`Selected: ${LOCALES[localeIndex].label}`); }
  else { config.locales = ['en']; ui.warning('Invalid selection, using English as default'); }
  console.log();
  ui.step(3, 'Configure optional features');
  const learnGit = await prompt('Enable Git learning? (y/N): ');
  config.features.learnFromGit = learnGit.toLowerCase() === 'y' || learnGit.toLowerCase() === 'yes';
  ui.success(`Git learning: ${config.features.learnFromGit ? 'enabled' : 'disabled'}`);
  const autoUpdate = await prompt('Enable auto-update memory? (y/N): ');
  config.features.autoUpdateMemory = autoUpdate.toLowerCase() === 'y' || autoUpdate.toLowerCase() === 'yes';
  ui.success(`Auto-update memory: ${config.features.autoUpdateMemory ? 'enabled' : 'disabled'}`);
  const reviewMode = await prompt('Enable review mode? (Y/n): ');
  config.features.reviewMode = reviewMode.toLowerCase() !== 'n' && reviewMode.toLowerCase() !== 'no';
  ui.success(`Review mode: ${config.features.reviewMode ? 'enabled' : 'disabled'}`);
  console.log();
  ui.step(4, 'Initialize memory');
  const initMem = await prompt('Initialize memory directories? (Y/n): ');
  if (initMem.toLowerCase() !== 'n' && initMem.toLowerCase() !== 'no') {
    try { await initMemory({ force: false, verbose: false }); ui.success('Memory initialized'); }
    catch (error) { ui.error('Memory initialization failed'); ui.error(error.message); }
  } else { ui.info('Memory initialization skipped'); }
  console.log();
  ui.step(5, 'Shell completion');
  const installComp = await prompt('Install shell completion? (Y/n): ');
  if (installComp.toLowerCase() !== 'n' && installComp.toLowerCase() !== 'no') {
    try {
      const targetShell = process.env.SHELL?.split('/').pop() || 'bash';
      const result = await installCompletion(targetShell);
      ui.success(`Completion installed for ${result.shell}`);
      ui.info(`Destination: ${result.destination}`);
      console.log(); ui.info(result.restartHint);
    } catch (error) { ui.error('Completion installation failed'); ui.error(error.message); }
  } else { ui.info('Shell completion skipped'); }
  console.log();
  ui.step(6, 'Save configuration');
  try {
    await fs.ensureDir(join(HOME_DIR, '.claude-antislop'));
    await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
    ui.success('Configuration saved'); ui.info(`Location: ${CONFIG_PATH}`);
  } catch (error) { ui.error('Failed to save configuration'); ui.error(error.message); }
  console.log();
  ui.divider(); ui.heading('✅ Setup Complete!'); ui.divider(); console.log();
  ui.info('Quick start commands:');
  console.log('  claude-antislop status          - Check plugin status');
  console.log('  claude-antislop memory-search   - Search memory');
  console.log('  claude-antislop scan            - Scan a repository');
  console.log('  claude-antislop learn-from-git  - Learn from Git history');
  console.log(); ui.info('Documentation: https://github.com/mednabouli/claude-antislop'); console.log();
  return config;
}
