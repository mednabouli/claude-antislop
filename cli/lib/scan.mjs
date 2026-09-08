import fs from 'fs-extra';
import { join, relative } from 'path';
import { ui } from './ui.mjs';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const MEMORY_DIR = join(HOME_DIR, '.claude-antislop', 'memory');
export async function scan(options = {}) {
  const { repo = process.cwd(), output = null, verbose = false } = options;
  if (!await fs.pathExists(repo)) {
    throw new Error(`Repository not found: ${repo}`);
  }
  const destDir = output || join(MEMORY_DIR, 'templates');
  await fs.ensureDir(destDir);
  const templates = [];
  const files = await fs.readdir(repo, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.js') || file.name.endsWith('.jsx'))) {
      const content = await fs.readFile(join(repo, file.name), 'utf-8');
      const lines = content.split('\n').length;
      if (lines > 50) {
        const templateFile = join(destDir, `${file.name}.md`);
        await fs.writeFile(templateFile, `# ${file.name}\n\n## Overview\n\nLines: ${lines}\n\n## Content\n\n\`\`\`${file.name.endsWith('x') ? 'tsx' : 'js'}\n${content.slice(0, 500)}\n...\n\`\`\`\n`);
        templates.push({ file: file.name, lines, template: `${file.name}.md` });
      }
    }
  }
  ui.success('Scan completed');
  ui.info(`Templates: ${templates.length}`);
  ui.info(`Output: ${destDir}`);
  return { success: true, message: 'Scan completed', data: { repo, output: destDir, templates, count: templates.length } };
}
