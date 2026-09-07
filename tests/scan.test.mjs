import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { scan } from '../cli/lib/scan.mjs';
import fs from 'fs-extra';
import { join } from 'path';

test('scan module', async (t) => {
  const testRepo = join(process.cwd(), 'tests', 'fixtures', 'test-repo');
  t.before(async () => { await fs.ensureDir(testRepo); await fs.writeJson(join(testRepo, 'package.json'), { name: 'test' }); });
  t.after(async () => { await fs.remove(testRepo); });

  await t.test('scan returns structured results', async () => {
    const result = await scan({ repo: testRepo, verbose: false });
    assert.equal(result.success, true);
    assert.ok(result.reportPath);
    assert.ok(result.report.analysis);
  });
  await t.test('detects languages', async () => {
    const result = await scan({ repo: testRepo, verbose: false });
    assert.ok(Array.isArray(result.report.analysis.languages));
  });
  await t.test('detects stacks', async () => {
    const result = await scan({ repo: testRepo, verbose: false });
    assert.ok(Array.isArray(result.report.analysis.stacks));
  });
  await t.test('generates templates', async () => {
    const result = await scan({ repo: testRepo, verbose: false });
    assert.ok(result.report.templates);
  });
});
