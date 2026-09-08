import { ui } from './ui.mjs';
export async function codeQualityCheck(options = {}) {
  const { code = '', language = 'typescript', checks = ['lint', 'typecheck', 'prettier'] } = options;
  if (!code) {
    throw new Error('No code provided. Use --code <code>');
  }
  const issues = [];
  if (checks.includes('lint')) {
    if (code.includes('var ')) {
      issues.push({ message: 'Avoid using var, use let or const', line: 1, severity: 'warning' });
    }
  }
  if (checks.includes('typecheck') && language === 'typescript') {
    if (code.includes(': any')) {
      issues.push({ message: 'Avoid using any type, use specific types', line: 1, severity: 'error' });
    }
  }
  if (checks.includes('prettier')) {
    if (code.includes('    ')) {
      issues.push({ message: 'Use 2-space indentation, not 4-space', line: 1, severity: 'warning' });
    }
  }
  if (issues.length > 0) {
    ui.error(`Found ${issues.length} issues`);
    return { success: false, message: `Found ${issues.length} issues`, data: { issues, count: issues.length } };
  }
  ui.success('No issues found');
  return { success: true, message: 'No issues found', data: { issues: [], count: 0 } };
}
