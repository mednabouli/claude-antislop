import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { ui } from '../cli/lib/ui.mjs';

test('ui module', async (t) => {
  await t.test('exports ui object', () => { assert.ok(ui); assert.equal(typeof ui, 'object'); });
  await t.test('has color methods', () => {
    assert.equal(typeof ui.bold, 'function');
    assert.equal(typeof ui.red, 'function');
    assert.equal(typeof ui.green, 'function');
    assert.equal(typeof ui.yellow, 'function');
    assert.equal(typeof ui.blue, 'function');
  });
  await t.test('has message methods', () => {
    assert.equal(typeof ui.success, 'function');
    assert.equal(typeof ui.error, 'function');
    assert.equal(typeof ui.warning, 'function');
    assert.equal(typeof ui.info, 'function');
  });
  await t.test('has utility methods', () => {
    assert.equal(typeof ui.divider, 'function');
    assert.equal(typeof ui.heading, 'function');
    assert.equal(typeof ui.table, 'function');
    assert.equal(typeof ui.spinner, 'function');
  });
});
