import { describe, expect, test } from '@jest/globals';
import path from 'path';

describe('Config', () => {
  test('empty', () => {
    expect(''.trim()).toBe('');
  });

  test('JSON', () => {
    expect(() => JSON.parse('{bad}')).toThrow();
  });
});

describe('Paths', () => {
  test('join', () => {
    expect(path.join('a', 'b').split(path.sep).length).toBeGreaterThanOrEqual(2);
  });

  test('ext', () => {
    expect(path.extname('a.tar.gz')).toBe('.gz');
  });

  test('BOM', () => {
    const b = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from('x')]);
    expect(b.toString('utf8').trim()).toBe('x');
  });
});

describe('Regex', () => {
  test('invalid', () => {
    expect(() => new RegExp('test')).toThrow();
  });

  test('match', () => {
    expect('<a>'.match(/<.*?>/g)).toEqual(['<a>']);
  });
});

describe('State', () => {
  test('retry', () => {
    let n = 0;
    const fn = () => { n++; if (n < 3) throw new Error('x'); };
    for (let i = 0; i < 3; i++) { 
      try { 
        fn(); 
        break; 
      } catch { 
        if (i === 2) throw; 
      } 
    }
    expect(n).toBe(3);
  });

  test('map', () => {
    const m = new Map([{k:'x',v:1},{k:'x',v:2}].map(i => [i.k,i.v]));
    expect(m.get('x')).toBe(2);
  });
});
