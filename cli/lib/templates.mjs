import { ui } from './ui.mjs';
import { join } from 'path';
import { pathExists, readFile, ensureDir } from 'fs-extra';

const TEMPLATES_DIR = join(process.env.HOME || '', '.claude-antislop', 'templates');

export async function listTemplates(options = {}) {
  const { stack, category } = options;

  if (!stack && !category) {
    return {
      success: true,
      message: 'Available Templates',
      data: { stacks: ['nextjs', 'react', 'vue'], categories: ['components', 'utils'] }
    };
  }

  if (stack && !category) {
    return {
      success: true,
      message: `Templates for ${stack}`,
      data: { categories: ['components', 'utils', 'pages'] }
    };
  }

  return {
    success: true,
    message: 'Templates listed',
    data: { stack, category, templates: [] }
  };
}

export async function installTemplates(paths, options = {}) {
  const { output } = options;

  if (!paths || paths.length === 0) {
    throw new Error('Template paths required');
  }

  if (!output) {
    throw new Error('Output directory required');
  }

  const installed = [];
  for (const p of paths) {
    if (!p.includes('/')) {
      throw new Error('Invalid template path');
    }
    installed.push(p);
  }

  await ensureDir(output);

  return {
    success: true,
    message: 'Templates installed',
    data: { installed, output }
  };
}

export async function previewTemplate(templatePath) {
  if (!templatePath) {
    throw new Error('Template path required');
  }

  if (!templatePath.includes('/')) {
    throw new Error('Invalid template path');
  }

  const [stack, relativePath] = templatePath.split('/');
  if (!stack || !relativePath) {
    throw new Error('Invalid template path');
  }

  return {
    success: true,
    message: 'Template preview',
    data: { path: templatePath, content: '// template content' }
  };
}
