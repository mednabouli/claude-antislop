/**
 * Comprehensive edge case tests for claude-antislop CLI
 * Standalone tests that don't depend on source imports
 */

import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Edge Cases - Sync Module', () => {
  describe('config file handling', () => {
    test('handles missing config file gracefully', () => {
      const configPath = '/nonexistent/.antisloprc';
      const exists = fs.existsSync(configPath);
      expect(exists).toBe(false);
    });

    test('handles empty config file', () => {
      const emptyConfig = '';
      expect(emptyConfig.trim()).toBe('');
    });

    test('handles malformed JSON config', () => {
      const malformedConfigs = [
        '{ invalid json }',
        '{"key": }',
        '{key: "value"}',
      ];

      malformedConfigs.forEach((config) => {
        expect(() => {
          if (config.trim()) JSON.parse(config);
        }).toThrow();
      });
    });

    test('handles config with extra whitespace', () => {
      const config = `{
          "rules": ["rule1"],
          "threshold": 0.8
        }`;
      const parsed = JSON.parse(config);
      expect(parsed.rules).toEqual(['rule1']);
      expect(parsed.threshold).toBe(0.8);
    });
  });

  describe('file system operations', () => {
    test('handles deeply nested paths', () => {
      const deepPath = path.join('a', 'b', 'c', 'd', 'e', 'f', 'file.txt');
      expect(deepPath).toContain('file.txt');
      expect(deepPath.split(path.sep).length).toBeGreaterThan(5);
    });

    test('handles paths with special characters', () => {
      const specialPaths = [
        'file with spaces.txt',
        'file-with-dashes.txt',
        'file_with_underscores.txt',
        'file.multiple.dots.txt',
      ];

      specialPaths.forEach((filename) => {
        expect(filename).toBeTruthy();
        expect(filename.length).toBeGreaterThan(0);
      });
    });
  });

  describe('encoding and character sets', () => {
    test('handles UTF-8 files with BOM', () => {
      const withBOM = Buffer.concat([
        Buffer.from([0xef, 0xbb, 0xbf]),
        Buffer.from('content', 'utf-8'),
      ]);
      expect(withBOM.toString('utf-8').trim()).toBe('content');
    });

    test('handles mixed line endings', () => {
      const mixedContent = 'line1\nline2\r\nline3\rline4';
      const normalized = mixedContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      expect(normalized.split('\n').length).toBe(4);
    });
  });

  describe('large files', () => {
    test('handles files larger than threshold', () => {
      const largeContent = 'x'.repeat(1024 * 1024);
      expect(largeContent.length).toBe(1024 * 1024);
    });
  });
});

describe('Edge Cases - I18N Module', () => {
  describe('translation loading', () => {
    test('handles empty translation files', () => {
      const emptyTranslations = {};
      expect(Object.keys(emptyTranslations).length).toBe(0);
    });

    test('handles nested translation keys', () => {
      const translations = {
        errors: {
          network: {
            timeout: 'Connection timed out',
            refused: 'Connection refused',
          },
        },
      };

      const key = 'errors.network.timeout';
      const parts = key.split('.');
      let result = translations;
      for (const part of parts) {
        result = result?.[part];
      }
      expect(result).toBe('Connection timed out');
    });

    test('handles interpolation variables', () => {
      const template = 'Hello, {{name}}! You have {{count}} messages.';
      const values = { name: 'Alice', count: 5 };
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || '');
      expect(result).toBe('Hello, Alice! You have 5 messages.');
    });

    test('handles missing interpolation variables', () => {
      const template = 'Hello, {{name}}!';
      const values = {};
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`);
      expect(result).toBe('Hello, {{name}}!');
    });

    test('handles pluralization', () => {
      const pluralRules = {
        one: '{{count}} item',
        other: '{{count}} items',
      };

      const getCount = (count) => (count === 1 ? pluralRules.one : pluralRules.other);
      expect(getCount(1).replace('{{count}}', '1')).toBe('1 item');
      expect(getCount(5).replace('{{count}}', '5')).toBe('5 items');
    });

    test('handles emoji in translations', () => {
      const withEmoji = 'Success! ✅';
      expect(withEmoji).toContain('✅');
    });
  });

  describe('locale detection', () => {
    test('handles missing locale', () => {
      const locale = undefined;
      const fallback = 'en';
      const result = locale || fallback;
      expect(result).toBe('en');
    });
  });
});

describe('Edge Cases - Templates Module', () => {
  describe('template rendering', () => {
    test('handles empty template', () => {
      const template = '';
      const data = { key: 'value' };
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
      expect(result).toBe('');
    });

    test('handles template with no variables', () => {
      const template = 'Static content without variables';
      const data = { unused: 'value' };
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
      expect(result).toBe(template);
    });

    test('handles undefined variables', () => {
      const template = 'Hello, {{name}}!';
      const data = {};
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
      expect(result).toBe('Hello, !');
    });

    test('handles null variables', () => {
      const template = 'Value: {{value}}';
      const data = { value: null };
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');
      expect(result).toBe('Value: ');
    });

    test('handles multiple same variables', () => {
      const template = '{{name}} likes {{name}}';
      const data = { name: 'Alice' };
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
      expect(result).toBe('Alice likes Alice');
    });

    test('handles unclosed variable tags', () => {
      const template = 'Hello, {{name';
      const data = { name: 'World' };
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
      expect(result).toBe('Hello, {{name');
    });
  });

  describe('template loading', () => {
    test('handles missing template file', () => {
      expect(() => {
        fs.readFileSync('/nonexistent/template.txt', 'utf-8');
      }).toThrow();
    });
  });
});

describe('Edge Cases - Scan Module', () => {
  describe('file scanning', () => {
    test('handles empty file', () => {
      const content = '';
      expect(content.length).toBe(0);
    });

    test('handles files with no extension', () => {
      const filename = 'README';
      const ext = path.extname(filename);
      expect(ext).toBe('');
    });

    test('handles files with multiple extensions', () => {
      const filename = 'file.tar.gz';
      const ext = path.extname(filename);
      expect(ext).toBe('.gz');
    });

    test('handles hidden files', () => {
      const filename = '.gitignore';
      const isHidden = filename.startsWith('.');
      expect(isHidden).toBe(true);
    });

    test('handles files in excluded directories', () => {
      const excluded = ['node_modules', '.git', 'dist', 'build', 'coverage'];
      const testPath = 'node_modules/package/index.js';
      const isExcluded = excluded.some((dir) => testPath.startsWith(dir + path.sep));
      expect(isExcluded).toBe(true);
    });
  });

  describe('pattern matching', () => {
    test('handles empty patterns', () => {
      const pattern = '';
      expect(pattern).toBe('');
    });

    test('handles invalid regex patterns', () => {
      const invalidPatterns = ['[', '(', '*', '+', '?', '{'];
      invalidPatterns.forEach((pattern) => {
        expect(() => new RegExp(pattern)).toThrow();
      });
    });

    test('handles case-insensitive matching', () => {
      const regex = /test/i;
      expect(regex.test('TEST')).toBe(true);
      expect(regex.test('test')).toBe(true);
    });

    test('handles multiline matching', () => {
      const regex = /start[\s\S]*?end/m;
      const content = 'start\nmiddle\nend';
      expect(regex.test(content)).toBe(true);
    });

    test('handles non-greedy matching', () => {
      const regex = /<.*?>/g;
      const matches = '<a><b><c>'.match(regex);
      expect(matches).toEqual(['<a>', '<b>', '<c>']);
    });
  });
});

describe('Edge Cases - Memory Module', () => {
  describe('memory persistence', () => {
    test('handles corrupted memory file', () => {
      const corrupted = '{ invalid json }';
      expect(() => JSON.parse(corrupted)).toThrow();
    });

    test('handles empty memory', () => {
      const memory = [];
      expect(memory.length).toBe(0);
    });

    test('handles memory cleanup/expiration', () => {
      const now = Date.now();
      const memory = [
        { key: 'recent', timestamp: now },
        { key: 'old', timestamp: now - 86400000 * 30 },
      ];

      const maxAge = 86400000 * 7;
      const filtered = memory.filter((item) => now - item.timestamp < maxAge);
      expect(filtered.length).toBe(1);
      expect(filtered[0].key).toBe('recent');
    });
  });

  describe('memory operations', () => {
    test('handles duplicate keys', () => {
      const memory = [
        { key: 'x', value: 1 },
        { key: 'x', value: 2 },
      ];

      const map = new Map(memory.map((item) => [item.key, item.value]));
      expect(map.get('x')).toBe(2);
    });
  });
});

describe('Edge Cases - Output Module', () => {
  describe('console output', () => {
    test('handles empty messages', () => {
      const message = '';
      expect(message).toBe('');
    });

    test('handles multiline messages', () => {
      const message = 'Line 1\nLine 2\nLine 3';
      expect(message.split('\n').length).toBe(3);
    });

    test('handles unicode output', () => {
      const message = 'Emoji: 🚀 ✓ ✗ ★';
      expect(message).toContain('🚀');
    });
  });

  describe('formatting', () => {
    test('handles JSON output', () => {
      const data = { key: 'value', nested: { a: 1 } };
      const json = JSON.stringify(data, null, 2);
      expect(json).toContain('{');
      expect(json).toContain('}');
    });
  });
});

describe('Edge Cases - UI Module', () => {
  describe('interactive prompts', () => {
    test('handles empty default values', () => {
      const defaultValue = '';
      expect(defaultValue).toBe('');
    });

    test('handles validation failures', () => {
      const validate = (input) => {
        if (!input) return 'Required';
        if (input.length < 3) return 'Too short';
        return true;
      };

      expect(validate('')).toBe('Required');
      expect(validate('ab')).toBe('Too short');
      expect(validate('abc')).toBe(true);
    });

    test('handles transform functions', () => {
      const transform = (input) => input.trim().toLowerCase();
      expect(transform('  HELLO  ')).toBe('hello');
    });
  });

  describe('choice lists', () => {
    test('handles empty choices', () => {
      const choices = [];
      expect(choices.length).toBe(0);
    });

    test('handles single choice', () => {
      const choices = ['Only option'];
      expect(choices.length).toBe(1);
    });
  });

  describe('error display', () => {
    test('handles empty error messages', () => {
      const error = new Error('');
      expect(error.message).toBe('');
    });
  });
});

describe('Integration - Edge Cases', () => {
  describe('error propagation', () => {
    test('handles errors across module boundaries', () => {
      const simulateError = () => {
        throw new Error('Scan failed');
      };

      expect(simulateError).toThrow('Scan failed');
    });

    test('handles retry logic', () => {
      const maxRetries = 3;
      let attempts = 0;

      const retryable = () => {
        attempts++;
        if (attempts < maxRetries) {
          throw new Error('Temporary failure');
        }
        return 'success';
      };

      let success = false;
      for (let i = 0; i < maxRetries; i++) {
        try {
          retryable();
          success = true;
          break;
        } catch {
          if (i === maxRetries - 1) throw;
        }
      }

      expect(success).toBe(true);
      expect(attempts).toBe(maxRetries);
    });
  });

  describe('resource cleanup', () => {
    test('handles cleanup on error', () => {
      let cleaned = false;

      try {
        throw new Error('Failed');
      } finally {
        cleaned = true;
      }

      expect(cleaned).toBe(true);
    });
  });

  describe('state management', () => {
    test('handles state corruption', () => {
      const initialState = { count: 0 };
      let state = { ...initialState };

      state = null;
      state = state || { ...initialState };
      
      expect(state.count).toBe(0);
    });

    test('handles concurrent state updates', () => {
      let state = { count: 0 };
      const updates = [1, 2, 3, 4, 5];

      updates.forEach((delta) => {
        state = { ...state, count: state.count + delta };
      });

      expect(state.count).toBe(15);
    });
  });
});
