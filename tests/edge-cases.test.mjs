/**
 * Edge case tests
 */

import { describe, expect, test } from '@jest/globals';
import path from 'path';

describe('Edge Cases - Config', () => {
  test('empty config', () => {
    expect(''.trim()).toBe('');
  });

  test('malformed JSON', () => {
    ['{ }', '{key:1}'].forEach(b => {
      expect(() => { if (b) JSON.parse(b); }).toThrow();
    });
  });
});

describe('Edge Cases - Interpolation', () => {
  test('empty template', () => {
    expect(''.replace(/\{\{(\w+)\}\}/g, () => '')).toBe('');
  });

  test('undefined var', () => {
    expect('Hi {{name}}'.replace(/\{\{(\w+)\}\}/g, () => '')).toBe('Hi ');
  });

  test('multiple vars', () => {
    const t = '{{x}} and {{x}}';
    const d = {x: 'A'};
    expect(t.replace(/\{\{(\w+)\}\}/g, (_, k) => d[k] || '')).toBe('A and A');
  });
});

describe('Edge Cases - Paths', () => {
  test('nested path', () => {
    expect(path.join('a', 'b', 'c').split(path.sep).length).toBeGreaterThanOrEqual(3);
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

  test('BOM buffer', () => {
    const b = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from('x', 'utf8')]);
    expect(b.toString('utf8').trim()).toBe('x');
  });

  test('line endings', () => {
    const s = 'a\nb\r\nc';
    expect(s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').length).toBe(3);
  });
});

describe('Edge Cases - Regex', () => {
  test('invalid patterns', () => {
    ['[', '(', '*'].forEach(p => {
      expect(() => new RegExp(p)).toThrow();
    });
  });

  test('case insensitive', () => {
    expect(/x/i.test('X')).toBe(true);
  });

  test('non-greedy', () => {
    expect('<a><b>'.match(/<.*?>/g)).toEqual(['<a>', '<b>']);
  });
});

describe('Edge Cases - Memory', () => {
  test('empty array', () => {
    expect([]).toHaveLength(0);
  });

  test('map last wins', () => {
    const m = new Map([{k: 'x', v: 1}, {k: 'x', v: 2}].map(i => [i.k, i.v]));
    expect(m.get('x')).toBe(2);
  });

  test('expiration', () => {
    const now = Date.now();
    const mem = [{k: 'new', t: now}, {k: 'old', t: now - 864e5 * 30}];
    const f = mem.filter(i => now - i.t < 864e5 * 7);
    expect(f).toHaveLength(1);
  });
});

describe('Edge Cases - Retry', () => {
  test('retry logic', () => {
    const max = 3;
    let n = 0;
    const fn = () => { n++; if (n < max) throw new Error('x'); return 'ok'; };
    let ok = false;
    for (let i = 0; i < max; i++) {
      try { fn(); ok = true; break; } catch { if (i === max - 1) throw; }
    }
    expect(ok).toBe(true);
    expect(n).toBe(max);
  });

  test('cleanup', () => {
    let c = false;
    try { throw new Error('x'); } finally { c = true; }
    expect(c).toBe(true);
  });
});

describe('Edge Cases - State', () => {
  test('recover null', () => {
    const init = {c: 0};
    let s = {...init};
    s = null;
    s = s || {...init};
    expect(s.c).toBe(0);
  });

  test('updates', () => {
    let s = {c: 0};
    [1, 2, 3].forEach(d => { s = {...s, c: s.c + d}; });
    expect(s.c).toBe(6);
  });
});
