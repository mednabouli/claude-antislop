import fs from 'fs-extra';
import { join } from 'path';
import { ui } from './ui.mjs';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const MEMORY_DIR = join(HOME_DIR, '.claude-antislop', 'memory');
const CATEGORIES = ['standards', 'patterns', 'anti-patterns', 'insights', 'reviews'];
export async function initMemory(options = {}) {
  const { force = false, verbose = false } = options;
  if (!force && await fs.pathExists(MEMORY_DIR)) {
    const files = await fs.readdir(MEMORY_DIR);
    if (files.length > 0 && !force) {
      throw new Error('Memory directory already exists. Use --force to overwrite.');
    }
  }
  await fs.ensureDir(MEMORY_DIR);
  for (const category of CATEGORIES) {
    await fs.ensureDir(join(MEMORY_DIR, category));
  }
  ui.success('Memory initialized');
  ui.info(`Location: ${MEMORY_DIR}`);
  return { success: true, message: 'Memory initialized', data: { path: MEMORY_DIR, categories: CATEGORIES } };
}
export async function memorySearch(options = {}) {
  const { query = '', category = 'all', limit = 5, fuzzy = true } = options;
  if (!await fs.pathExists(MEMORY_DIR)) {
    throw new Error('Memory directory not found. Run `claude-antislop init-memory` first.');
  }
  const results = [];
  const categories = category === 'all' ? CATEGORIES : [category];
  for (const cat of categories) {
    const catDir = join(MEMORY_DIR, cat);
    if (!await fs.pathExists(catDir)) continue;
    const files = await fs.readdir(catDir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const content = await fs.readFile(join(catDir, file), 'utf-8');
      if (fuzzy ? content.toLowerCase().includes(query.toLowerCase()) : content.includes(query)) {
        results.push({ file: `${cat}/${file}`, score: 1, content: content.slice(0, 200) });
      }
    }
  }
  results.sort((a, b) => b.score - a.score);
  const limited = results.slice(0, parseInt(limit));
  ui.success(`Found ${limited.length} results`);
  return { success: true, message: `Found ${limited.length} results`, data: { query, category, results: limited, count: limited.length } };
}
export async function memoryWrite(options = {}) {
  const { category = 'standards', filename = '', content = '', append = false } = options;
  if (!category || !filename || !content) {
    throw new Error('Missing required options: --category, --filename, --content');
  }
  if (!CATEGORIES.includes(category)) {
    throw new Error(`Invalid category. Must be one of: ${CATEGORIES.join(', ')}`);
  }
  await fs.ensureDir(MEMORY_DIR);
  const catDir = join(MEMORY_DIR, category);
  await fs.ensureDir(catDir);
  const filePath = join(catDir, filename);
  if (append && await fs.pathExists(filePath)) {
    await fs.appendFile(filePath, '\n\n' + content);
  } else {
    await fs.writeFile(filePath, content);
  }
  ui.success('Memory written');
  ui.info(`Location: ${filePath}`);
  return { success: true, message: 'Memory written', data: { path: filePath, category, filename, append } };
}
export async function getMemoryPath() {
  return MEMORY_DIR;
}
