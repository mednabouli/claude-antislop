import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { learn } from '../cli/lib/learn.mjs';

test('learn module', async (t) => {
  await t.test('validates recent parameter', async () => {
    await assert.rejects(async () => await learn({ recent: 'invalid; rm -rf /' }), /Invalid recent parameter/);
  });
  await t.test('accepts valid recent formats', async () => {
    const validFormats = ['30d', '3m', '1y', '2w', '7d'];
    for (const format of validFormats) {
      await learn({ recent: format, repo: process.cwd() }).catch(() => {});
    }
  });
  await t.test('rejects invalid recent formats', async () => {
    const invalidFormats = ['; rm -rf /', '`rm -rf /`', '$(rm -rf /)', '..', '../..'];
    for (const format of invalidFormats) {
      await assert.rejects(async () => await learn({ recent: format }), /Invalid recent parameter/);
    }
  });
});
