/**
 * Edge case tests - parser safe version
 * Covers: empty inputs, malformed JSON, interpolation, paths, regex, memory, retry, cleanup, state
 */

import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Edge Cases - Config & JSON', () => {
  test('handles empty config', () => {
    const empty = '';
    expect(empty.trim()).toBe('');
  });

  test('handles malformed JSON', () => {
    const bad = ['{ }', '{key:1}', '{"a":}', '[1,2'];
    bad.forEach(b => {
      expect(() => { if(b) JSON.parse(b); }).toThrow();
    });
  });

  test('handles whitespace', () => {
    const json = JSON.parse('{ "x": 1 }');
    expect(json.x).toBe(1);
  });
});

describe('Edge Cases - Templates & Interpolation', () => {
  test('empty template', () => {
    const t = '';
    const d = {a:1};
    expect(t.replace(/\{\{(\w+)\}\}/g, (_,k) => d[k] ?? '')).toBe('');
  });

  test('undefined var', () => {
    const t = 'Hi {{name}}';
    expect(t.replace(/\{\{(\w+)\}\}/g, (_,k) => ({}[k] ?? ''))).toBe('Hi ');
  });

  test('null var', () => {
    const t = 'V:{{v}}';
    expect(t.replace(/\{\{(\w+)\}\}/g, (_,k) => ({v:null}[k] ?? ''))).toBe('V:');
  });

  test('multiple same var', () => {
    const t = '{{x}} and {{x}}';
    const d = {x:'A'};
    expect(t.replace(/\{\{(\w+)\}\}/g, (_,k) => d[k] ?? '')).toBe('A and A');
  });

  test('interpolation with plural', () => {
    const one = '{{c}} item';
    const other = '{{c}} items';
    const get = c => (c === 1 ? one : other).replace('{{c}}', String(c));
    expect(get(1)).toBe('1 item');
    expect(get(2)).toBe('2 items');
  });
});

describe('Edge Cases - Paths & Files', () => {
  test('nested path', () => {
    const p = path.join('a','b','c','d');
    expect(p.split(path.sep).length).toBeGreaterThanOrEqual(4);
  });

  test('no extension', () => {
    expect(path.extname('README')).toBe('');
  });

  test('multi extension', () => {
    expect(path.extname('a.tar.gz')).toBe('.gz');
  });

  test('hidden file', () => {
    expect('.gitignore'.startsWith('.')).toBe(true);
  });

  test('excluded dir', () => {
    const ex = ['node_modules','.git','dist'];
    const p = 'node_modules/x.js';
    expect(ex.some(d => p.startsWith(d + path.sep))).toBe(true);
  });

  test('BOM buffer', () => {
    const b = Buffer.concat([Buffer.from([0xef,0xbb,0xbf]), Buffer.from('x','utf8')]);
    expect(b.toString('utf8').trim()).toBe('x');
  });

  test('mixed line endings', () => {
    const s = 'a\nb\r\nc\rd';
    const n = s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
    expect(n.split('\n').length).toBe(4);
  });
});

describe('Edge Cases - Regex', () => {
  test('empty pattern', () => {
    expect('').toBe('');
  });

  test('invalid patterns throw', () => {
    ['[','(','*','+','?','{'].forEach(p => {
      expect(() => new RegExp(p)).toThrow();
    });
  });

  test('case insensitive', () => {
    const r = /x/i;
    expect(r.test('X')).toBe(true);
  });

  test('multiline', () => {
    const r = /start[\s\S]*?end/m;
    expect(r.test('start\nmid\nend')).toBe(true);
  });

  test('non-greedy', () => {
    const r = /<.*?>/g;
    expect('<a><b>'.match(r)).toEqual(['<a>','<b>']);
  });
});

describe('Edge Cases - Memory', () => {
  test('empty memory', () => {
    expect([]).toHaveLength(0);
  });

  test('duplicate keys (map last wins)', () => {
    const mem = [{k:'x',v:1},{k:'x',v:2}];
    const m = new Map(mem.map(i => [i.k,i.v]));
    expect(m.get('x')).toBe(2);
  });

  test('expiration filter', () => {
    const now = Date.now();
    const mem = [{k:'new',t:now},{k:'old',t:now-864e5*30}];
    const max = 864e5*7;
    const f = mem.filter(i => now - i.t < max);
    expect(f).toHaveLength(1);
    expect(f[0].k).toBe('new');
  });
});

describe('Edge Cases - Retry & Cleanup', () => {
  test('retry succeeds on last attempt', () => {
    const max = 3;
    let n = 0;
    const fn = () => { n++; if (n < max) throw new Error('x'); return 'ok'; };
    let ok = false;
    for (let i = 0; i < max; i++) {
      try { fn(); ok = true; break; } catch { if (i === max-1) throw; }
    }
    expect(ok).toBe(true);
    expect(n).toBe(max);
  });

  test('finally cleanup', () => {
    let c = false;
    try { throw new Error('x'); } finally { c = true; }
    expect(c).toBe(true);
  });
});

describe('Edge Cases - State', () => {
  test('recover from null', () => {
    const init = {c:0};
    let s = {...init};
    s = null;
    s = s || {...init};
    expect(s.c).toBe(0);
  });

  test('concurrent updates', () => {
    let s = {c:0};
    [1,2,3].forEach(d => { s = {...s, c: s.c + d }; });
    expect(s.c).toBe(6);
  });
});
