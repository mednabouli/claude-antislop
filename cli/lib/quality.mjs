#!/usr/bin/env node

/**
 * Code quality check command
 * 
 * SECURITY: Temp files are always cleaned up in finally block
 */

import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const INSTALL_DIR = join(HOME_DIR, '.claude-antislop');
const TEMP_DIR = join(INSTALL_DIR, 'temp');

export async function codeQualityCheck(options = {}) {
  const { code, language = 'typescript', checks = ['lint', 'typecheck', 'prettier'] } = options;
  await fs.ensureDir(TEMP_DIR);
  const ext = language === 'typescript' ? 'ts' : 'js';
  const tempFile = join(TEMP_DIR, `check-${Date.now()}.${ext}`);
  
  try {
    await fs.writeFile(tempFile, code);
    const results = { success: true, checks: {}, file: tempFile, language };

    if (checks.includes('lint')) {
      try {
        const { stdout, stderr } = await execAsync(`eslint ${tempFile} --format=json`, { cwd: process.cwd(), timeout: 10000 });
        results.checks.lint = { success: true, output: stdout ? JSON.parse(stdout) : [], errors: stderr || '', message: 'No lint errors' };
      } catch (error) {
        if (error.stdout) {
          results.checks.lint = { success: false, output: JSON.parse(error.stdout), errors: error.stderr || '', message: 'Lint errors found' };
        } else {
          results.checks.lint = { success: false, output: [], errors: error.message, message: 'ESLint not configured or error' };
        }
      }
    }

    if (checks.includes('typecheck')) {
      try {
        const { stdout, stderr } = await execAsync(`tsc ${tempFile} --noEmit --skipLibCheck`, { cwd: process.cwd(), timeout: 10000 });
        results.checks.typecheck = { success: true, output: stdout || '', errors: stderr || '', message: 'No type errors' };
      } catch (error) {
        results.checks.typecheck = { success: false, output: error.stdout || '', errors: error.stderr || error.message, message: 'Type errors found' };
      }
    }

    if (checks.includes('prettier')) {
      try {
        const { stdout, stderr } = await execAsync(`prettier --check ${tempFile}`, { cwd: process.cwd(), timeout: 5000 });
        results.checks.prettier = { success: true, output: stdout || '', errors: stderr || '', message: 'Code is formatted correctly', formatted: true };
      } catch (error) {
        results.checks.prettier = { success: false, output: error.stdout || '', errors: error.stderr || '', message: 'Code is not formatted according to Prettier', formatted: false, suggestion: 'Run: prettier --write ' + tempFile };
      }
    }

    results.success = Object.values(results.checks).every(check => check.success);
    results.summary = { totalChecks: Object.keys(results.checks).length, passedChecks: Object.values(results.checks).filter(c => c.success).length, failedChecks: Object.values(results.checks).filter(c => !c.success).length, overall: results.success ? 'All checks passed' : 'Some checks failed' };
    return results;
  } finally {
    try { await fs.remove(tempFile); } catch {}
  }
}

export async function fixCodeWithPrettier(code, language = 'typescript') {
  const ext = language === 'typescript' ? 'ts' : 'js';
  const tempFile = join(TEMP_DIR, `prettier-fix-${Date.now()}.${ext}`);
  try {
    await fs.writeFile(tempFile, code);
    const { stdout } = await execAsync(`prettier --write ${tempFile}`, { cwd: process.cwd(), timeout: 5000 });
    const formattedCode = await fs.readFile(tempFile, 'utf-8');
    return { success: true, code: formattedCode, message: 'Code formatted successfully' };
  } catch (error) {
    return { success: false, code, error: error.message, message: 'Failed to format code' };
  } finally {
    try { await fs.remove(tempFile); } catch {}
  }
}
