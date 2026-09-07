#!/usr/bin/env node

/**
 * Performance Benchmark Script for Claude AntiSlop
 * 
 * Usage:
 *   node scripts/benchmark.js
 *   node scripts/benchmark.js --project medium-app
 *   node scripts/benchmark.js --config .antisloprc.benchmark.json
 *   node scripts/benchmark.js --report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BENCHMARK_DIR = path.join(__dirname, '..', 'tests', 'benchmarks');
const PROJECTS = {
  'small-app': { files: 100, expected: '<500ms' },
  'medium-app': { files: 1000, expected: '<2s' },
  'large-monorepo': { files: 10000, expected: '<15s' },
};

// Parse arguments
const args = process.argv.slice(2);
const selectedProject = args.find(arg => arg.startsWith('--project='))?.split('=')[1];
const customConfig = args.find(arg => arg.startsWith('--config='))?.split('=')[1];
const shouldReport = args.includes('--report');

/**
 * Run benchmark on a test project
 */
function runBenchmark(projectName) {
  const projectPath = path.join(BENCHMARK_DIR, projectName);
  
  if (!fs.existsSync(projectPath)) {
    console.warn(`⚠️  Project ${projectName} not found, skipping...`);
    return null;
  }

  console.log(`\n📊 Project: ${projectName}`);
  
  // Count files
  const fileCount = countFiles(projectPath);
  console.log(`   Files: ${fileCount}`);

  // Cold start benchmark
  const coldStart = measureTime(() => {
    execSync(`node ${path.join(__dirname, '..', 'cli', 'src', 'index.ts')} check ${projectPath}`, {
      stdio: 'pipe',
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' }
    });
  });

  console.log(`   Cold start: ${formatTime(coldStart)} (${Math.round(fileCount / (coldStart / 1000))} files/sec)`);

  // Memory usage (approximate)
  const memory = process.memoryUsage();
  console.log(`   Memory: ${formatBytes(memory.heapUsed)} peak`);

  return {
    project: projectName,
    files: fileCount,
    coldStart,
    memory: memory.heapUsed,
  };
}

/**
 * Count files in directory
 */
function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      count += countFiles(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      count++;
    }
  }
  
  return count;
}

/**
 * Measure execution time in milliseconds
 */
function measureTime(fn) {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

/**
 * Format time for display
 */
function formatTime(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format bytes for display
 */
function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}MB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

/**
 * Generate performance report
 */
function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: require('os').cpus().length,
    },
    benchmarks: results.filter(r => r !== null),
  };

  const reportPath = path.join(__dirname, '..', 'benchmark-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Running benchmarks...\n');
  
  const projects = selectedProject ? [selectedProject] : Object.keys(PROJECTS);
  const results = [];

  for (const project of projects) {
    const result = runBenchmark(project);
    results.push(result);
  }

  if (shouldReport) {
    generateReport(results);
  }

  console.log('\n✅ Benchmarks complete!\n');
  
  // Summary
  const validResults = results.filter(r => r !== null);
  if (validResults.length > 0) {
    const avgTime = validResults.reduce((sum, r) => sum + r.coldStart, 0) / validResults.length;
    const avgFiles = validResults.reduce((sum, r) => sum + r.files, 0) / validResults.length;
    console.log(`📈 Average: ${formatTime(avgTime)} for ${Math.round(avgFiles)} files (${Math.round(avgFiles / (avgTime / 1000))} files/sec)`);
  }
}

// Run
main();
