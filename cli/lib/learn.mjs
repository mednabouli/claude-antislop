#!/usr/bin/env node

/**
 * Learn from Git command
 * 
 * SECURITY: Validates 'recent' parameter to prevent command injection
 */

import { join } from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ui } from './ui.mjs';

const execAsync = promisify(exec);
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const INSTALL_DIR = join(HOME_DIR, '.claude-antislop');
const LEARN_OUTPUT_DIR = join(INSTALL_DIR, 'learn-output');

const PATTERN_DETECTORS = {
  conventional: { pattern: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:/, description: 'Uses conventional commits' },
  feature: { pattern: /(feat|feature|add|create|implement|new)/i, description: 'Feature development' },
  fix: { pattern: /(fix|bug|patch|resolve|repair)/i, description: 'Bug fixes' },
  refactor: { pattern: /(refactor|restructure|reorganize|cleanup|clean up)/i, description: 'Refactoring' },
  docs: { pattern: /(docs|documentation|readme|comment)/i, description: 'Documentation updates' },
  perf: { pattern: /(perf|performance|optimize|speed|fast)/i, description: 'Performance improvements' },
  test: { pattern: /(test|spec|coverage)/i, description: 'Testing' },
  security: { pattern: /(security|auth|encrypt|protect|vulnerability)/i, description: 'Security improvements' },
  deps: { pattern: /(deps|dependencies|upgrade|update|bump)/i, description: 'Dependency updates' },
  hotfix: { pattern: /(hotfix|urgent|critical|emergency)/i, description: 'Hotfixes' }
};

function isValidRecent(recent) {
  if (!recent || typeof recent !== 'string') return false;
  return /^\d+[dwm y]$/.test(recent.toLowerCase());
}

export async function learn(options = {}) {
  const { repo = process.cwd(), recent = '30d', verbose = false } = options;
  if (!isValidRecent(recent)) throw new Error('Invalid recent parameter. Must be format like "30d", "3m", "1y", "2w"');

  ui.divider();
  ui.heading('Learning from Git History');
  ui.divider();
  const spinner = ui.spinner('Analyzing commits...');
  if (!verbose) spinner.start();

  try {
    await fs.ensureDir(LEARN_OUTPUT_DIR);
    const { stdout } = await execAsync(`git log --since="${recent}" --format="%H|%an|%ae|%ad|%s" --date=short`, { cwd: repo });
    const commits = stdout.split('\n').filter(line => line.trim()).map(line => { const [hash, author, email, date, subject] = line.split('|'); return { hash, author, email, date, subject }; });
    const analysis = analyzePatterns(commits);
    const insights = generateInsights(analysis.patterns, commits.length);
    const report = { repo, days: recent, history: { commits }, analysis, insights, lessons: insights.map(i => ({ type: i.type, insight: i.insight, recommendation: i.recommendation })), updates: analysis.patterns };
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = join(LEARN_OUTPUT_DIR, `learn-report-${timestamp}.json`);
    await fs.writeJson(reportPath, report, { spaces: 2 });
    if (!verbose) spinner.succeed('Learning complete'); else ui.success('Learning complete');
    ui.divider();
    ui.success(`Report saved to: ${reportPath}`);
    ui.divider();
    ui.info(`Commits analyzed: ${commits.length}`);
    ui.info(`Patterns detected: ${analysis.patterns.length}`);
    ui.info(`Insights generated: ${insights.length}`);
    return { success: true, reportPath, report };
  } catch (error) {
    if (!verbose) spinner.fail('Learning failed');
    ui.error('Learning failed');
    ui.error(error.message);
    throw error;
  }
}

function analyzePatterns(commits) {
  const patternCounts = {};
  const patternExamples = {};
  for (const commit of commits) {
    for (const [patternName, detector] of Object.entries(PATTERN_DETECTORS)) {
      if (detector.pattern.test(commit.subject)) {
        patternCounts[patternName] = (patternCounts[patternName] || 0) + 1;
        if (!patternExamples[patternName]) patternExamples[patternName] = [];
        if (patternExamples[patternName].length < 3) patternExamples[patternName].push(commit.subject);
      }
    }
  }
  const total = commits.length;
  const patterns = Object.entries(patternCounts).map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100), description: PATTERN_DETECTORS[name].description, examples: patternExamples[name] || [] }));
  patterns.sort((a, b) => b.count - a.count);
  return { patterns, insights: [], totalCommits: total };
}

function generateInsights(patterns, totalCommits) {
  const insights = [];
  const conventional = patterns.find(p => p.name === 'conventional');
  if (conventional && conventional.count > totalCommits * 0.5) insights.push({ type: 'conventional_commits', insight: 'Consistently uses conventional commits', evidence: `${conventional.count}/${totalCommits} commits (${conventional.percentage}%)`, recommendation: 'Continue using conventional commits', confidence: 'high' });
  const feature = patterns.find(p => p.name === 'feature');
  const fix = patterns.find(p => p.name === 'fix');
  if (feature && fix) { const ratio = feature.count / (feature.count + fix.count); insights.push({ type: 'development_focus', insight: ratio > 0.6 ? 'Feature-focused development' : ratio < 0.4 ? 'Maintenance-focused development' : 'Balanced development', evidence: `${feature.count} features, ${fix.count} fixes`, recommendation: ratio < 0.3 ? 'Consider allocating time for new features' : ratio > 0.8 ? 'Consider allocating time for bug fixes' : 'Good balance', confidence: 'medium' }); }
  const refactor = patterns.find(p => p.name === 'refactor');
  if (refactor && refactor.count > totalCommits * 0.1) insights.push({ type: 'code_quality', insight: 'Regular refactoring for code quality', evidence: `${refactor.count} refactors (${refactor.percentage}%)`, recommendation: 'Continue refactoring to maintain code quality', confidence: 'high' });
  const test = patterns.find(p => p.name === 'test');
  if (test && test.count > totalCommits * 0.15) insights.push({ type: 'testing_culture', insight: 'Strong testing culture', evidence: `${test.count} test commits (${test.percentage}%)`, recommendation: 'Continue writing tests', confidence: 'high' });
  else if (test && test.count < totalCommits * 0.05) insights.push({ type: 'testing_gap', insight: 'Limited testing activity', evidence: `Only ${test.count} test commits (${test.percentage}%)`, recommendation: 'Consider increasing test coverage', confidence: 'medium' });
  return insights;
}
