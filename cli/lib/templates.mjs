import fs from 'fs-extra';
import { join } from 'path';
import { ui } from './ui.mjs';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const MEMORY_DIR = join(HOME_DIR, '.claude-antislop', 'memory');
const TEMPLATES_DIR = join(process.cwd(), 'templates');
const STACKS = {
  nextjs: { label: 'Next.js', categories: ['standards', 'patterns'], files: 3 },
  react: { label: 'React', categories: ['standards'], files: 1 },
  vue: { label: 'Vue 3', categories: ['standards', 'patterns'], files: 2 },
  svelte: { label: 'Svelte', categories: ['standards'], files: 1 },
  nodejs: { label: 'Node.js', categories: ['standards', 'patterns'], files: 2 },
  python: { label: 'Python', categories: ['standards'], files: 2 },
  general: { label: 'General', categories: ['standards', 'patterns', 'anti-patterns'], files: 5 }
};
export async function listTemplates(options = {}) {
  const { json = false } = options;
  const available = [];
  for (const [stack, info] of Object.entries(STACKS)) {
    for (const category of info.categories) {
      const templateDir = join(TEMPLATES_DIR, stack, category);
      if (await fs.pathExists(templateDir)) {
        const files = await fs.readdir(templateDir);
        for (const file of files) {
          if (file.endsWith('.md')) available.push({ stack, category, file, path: `${stack}/${category}/${file}` });
        }
      }
    }
  }
  if (json) return { success: true, message: 'Templates listed', data: { templates: available, count: available.length } };
  ui.divider(); ui.heading('📦 Available Templates'); ui.divider(); console.log();
  const byStack = {};
  for (const t of available) { if (!byStack[t.stack]) byStack[t.stack] = []; byStack[t.stack].push(t); }
  for (const [stack, templates] of Object.entries(byStack)) {
    ui.info(`${STACKS[stack].label} (${templates.length} files):`);
    for (const t of templates) console.log(`  - ${t.category}/${t.file}`);
    console.log();
  }
  return { success: true, message: 'Templates listed', data: { templates: available, count: available.length } };
}
export async function installTemplates(stack, options = {}) {
  const { category = null, memory = null, json = false } = options;
  const targetMemory = memory || MEMORY_DIR;
  if (!STACKS[stack]) throw new Error(`Unknown stack: ${stack}. Available: ${Object.keys(STACKS).join(', ')}`);
  const stackDir = join(TEMPLATES_DIR, stack);
  if (!await fs.pathExists(stackDir)) throw new Error(`Templates not found for stack: ${stack}`);
  await fs.ensureDir(targetMemory);
  const categories = category ? [category] : STACKS[stack].categories;
  const installed = [];
  for (const cat of categories) {
    const srcCatDir = join(stackDir, cat); const destCatDir = join(targetMemory, cat);
    if (!await fs.pathExists(srcCatDir)) continue;
    await fs.ensureDir(destCatDir);
    const files = await fs.readdir(srcCatDir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      await fs.copyFile(join(srcCatDir, file), join(destCatDir, file));
      installed.push(`${cat}/${file}`);
    }
  }
  if (json) return { success: true, message: `Installed ${installed.length} templates`, data: { stack, installed, count: installed.length } };
  ui.success(`Installed ${installed.length} templates for ${STACKS[stack].label}`);
  ui.info(`Memory: ${targetMemory}`); console.log(); ui.info('Installed files:');
  for (const file of installed) console.log(`  ✓ ${file}`);
  console.log(); ui.info('Usage: claude-antislop memory-search --query "your topic"');
  return { success: true, message: `Installed ${installed.length} templates`, data: { stack, installed, count: installed.length } };
}
export async function previewTemplate(templatePath, options = {}) {
  const { json = false } = options;
  const [stack, ...rest] = templatePath.split('/'); const relativePath = rest.join('/');
  if (!stack || !relativePath) throw new Error('Invalid template path. Use: stack/category/file.md');
  const filePath = join(TEMPLATES_DIR, stack, relativePath);
  if (!await fs.pathExists(filePath)) throw new Error(`Template not found: ${templatePath}`);
  const content = await fs.readFile(filePath, 'utf-8');
  if (json) return { success: true, message: 'Template preview', data: { path: templatePath, content } };
  ui.divider(); ui.heading(`📄 Preview: ${templatePath}`); ui.divider(); console.log(); console.log(content);
  return { success: true, message: 'Template preview', data: { path: templatePath, content } };
}
export function getAvailableStacks() { return Object.keys(STACKS); }
export function getStackInfo(stack) { return STACKS[stack] || null; }
