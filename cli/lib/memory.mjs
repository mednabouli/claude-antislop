#!/usr/bin/env node

/**
 * Memory management utilities - SECURITY HARDENED
 * Prevents path traversal attacks via filename validation
 */

import fs from 'fs-extra';
import { join, normalize, basename } from 'path';

const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const MEMORY_DIR = join(HOME_DIR, '.claude-antislop', 'memory');
const VALID_CATEGORIES = ['standards', 'patterns', 'anti-patterns', 'insights', 'reviews'];

/**
 * SECURITY: Validate filename to prevent path traversal
 */
function isValidFilename(filename) {
  if (!filename || typeof filename !== 'string') return false;
  const base = basename(filename);
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) return false;
  if (filename.includes('\0')) return false;
  const normalized = normalize(filename);
  if (normalized !== base) return false;
  if (!base.endsWith('.md') && !/^[a-zA-Z0-9_-]+$/.test(base)) return false;
  if (base.length > 255) return false;
  return true;
}

export async function initMemory(options = {}) {
  const { force = false, verbose = false } = options;
  if (!force && await fs.pathExists(MEMORY_DIR)) { if (verbose) console.log('Memory directory already exists'); return { success: true, message: 'Memory already initialized' }; }
  if (force && await fs.pathExists(MEMORY_DIR)) await fs.remove(MEMORY_DIR);
  await fs.ensureDir(MEMORY_DIR);
  for (const category of VALID_CATEGORIES) {
    await fs.ensureDir(join(MEMORY_DIR, category));
    const readmePath = join(MEMORY_DIR, category, 'README.md');
    await fs.writeFile(readmePath, `# ${category.charAt(0).toUpperCase() + category.slice(1)}\n\nStore your ${category} here.\n`);
  }
  return { success: true, path: MEMORY_DIR, categories: VALID_CATEGORIES, message: 'Memory initialized successfully' };
}

export async function memorySearch(options = {}) {
  const { query, category = 'all', limit = 5, useFuzzy = true } = options;
  if (!await fs.pathExists(MEMORY_DIR)) return { success: false, error: 'Memory directory not found. Run "claude-antislop install --init-memory" to initialize.', results: [] };
  const categories = category === 'all' ? VALID_CATEGORIES : [category];
  const allResults = [];
  for (const cat of categories) {
    const catDir = join(MEMORY_DIR, cat);
    if (!await fs.pathExists(catDir)) continue;
    const files = await fs.readdir(catDir);
    for (const file of files) {
      if (!file.endsWith('.md') || file === 'README.md') continue;
      const filePath = join(catDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const score = useFuzzy ? calculateFuzzyScore(query, content) : calculateSimpleScore(query, content);
      if (score > 0.3) allResults.push({ file: `${cat}/${file}`, path: filePath, relevance: Math.round(score * 100), excerpt: content.substring(0, 500) + (content.length > 500 ? '...' : ''), category: cat, matchType: useFuzzy ? 'fuzzy' : 'exact' });
    }
  }
  allResults.sort((a, b) => b.relevance - a.relevance);
  const topResults = allResults.slice(0, limit);
  return { success: true, query, category, useFuzzy, results: topResults, total: allResults.length, returned: topResults.length };
}

export async function memoryWrite(options = {}) {
  const { category = 'standards', filename, content, append = false } = options;
  if (!VALID_CATEGORIES.includes(category)) return { success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` };
  if (!filename) return { success: false, error: 'Filename is required' };
  if (!isValidFilename(filename)) return { success: false, error: 'Invalid filename. Must be alphanumeric with hyphens/underscores, no path separators or .. sequences' };
  if (!content) return { success: false, error: 'Content is required' };
  const catDir = join(MEMORY_DIR, category);
  await fs.ensureDir(catDir);
  const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
  const filePath = join(catDir, safeFilename);
  const resolvedPath = await fs.realpath(filePath).catch(() => filePath);
  if (!resolvedPath.startsWith(MEMORY_DIR)) return { success: false, error: 'Invalid file path' };
  if (append && await fs.pathExists(filePath)) {
    const existing = await fs.readFile(filePath, 'utf-8');
    await fs.writeFile(filePath, existing + '\n\n' + content);
  } else {
    await fs.writeFile(filePath, content);
  }
  return { success: true, file: `${category}/${safeFilename}`, path: filePath, action: append ? 'appended' : 'created', size: content.length };
}

function calculateFuzzyScore(query, text) {
  const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const textTokens = text.toLowerCase().split(/\s+/);
  if (queryTokens.length === 0) return 0;
  let matchCount = 0, partialMatchCount = 0;
  for (const queryToken of queryTokens) {
    let exactMatch = false, partialMatch = false;
    for (const textToken of textTokens) {
      if (textToken === queryToken) { exactMatch = true; break; }
      if (textToken.includes(queryToken) || textToken.startsWith(queryToken.slice(0, 4))) partialMatch = true;
      if (queryToken.length >= 4 && textToken.length >= 4) {
        const diff = Math.abs(textToken.length - queryToken.length);
        if (diff <= 2 && textToken.slice(0, Math.min(4, queryToken.length)) === queryToken.slice(0, Math.min(4, queryToken.length))) partialMatch = true;
      }
    }
    if (exactMatch) matchCount += 2; else if (partialMatch) partialMatchCount += 1;
  }
  return Math.min((matchCount * 2 + partialMatchCount) / (queryTokens.length * 2), 1.0);
}

function calculateSimpleScore(query, content) {
  const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);
  const contentLower = content.toLowerCase();
  const matches = keywords.filter(k => contentLower.includes(k));
  return matches.length / keywords.length;
}
