import { describe, expect, test } from '@jest/globals';
import path from 'path';

describe('Edge Cases', () => {
  test('empty string', () => {
    expect(''.trim()).toBe('');
  });

  test('JSON parse error', () => {
    expect(() => JSON.parse('{bad}')).toThrow();
  });

  test('path join', () => {
    const p = path.join('a', 'b');
    expect(p.split(path.sep).length).toBeGreaterThanOrEqual(2);
  });

  test('path extension', () => {
    expect(path.extname('file.tar.gz')).toBe('.gz');
  });

  test('BOM handling', () => {
    const b = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from('x')]);
    expect(b.toString('utf8').trim()).toBe('x');
  });

  test('regex match', () => {
    const m = '<a><b>'.match(/<.*?>/g);
    expect(m).toEqual(['<a>', '<b>']);
  });

  test('retry logic', () => {
    let n = 0;
    const fn = () => { n++; if (n < 3) throw new Error('x'); };
    for (let i = 0; i < 3; i++) {
      try { fn(); break; } catch { if (i === 2) throw; }
    }
    expect(n).toBe(3);
  });

  test('map last wins', () => {
    const m = new Map([{k:'x',v:1},{k:'x',v:2}].map(i => [i.k,i.v]));
    expect(m.get('x')).toBe(2);
  });
});
