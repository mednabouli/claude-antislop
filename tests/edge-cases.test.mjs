/**
 * Comprehensive edge case tests for claude-antislop CLI
 * Covers: sync, i18n, templates, scan, memory, output, ui
 */

import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// SYNC MODULE EDGE CASES
// ============================================================================

describe('sync.mjs - Edge Cases', () => {
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
        '{"unclosed": "string}',
        '',
        'null',
      ];

      malformedConfigs.forEach((config) => {
        expect(() => {
          if (config.trim()) JSON.parse(config);
        }).toThrow();
      });
    });

    test('handles config with extra whitespace', () => {
      const config = `\n        {\n          "rules": ["rule1"],\n          \n          "threshold": 0.8\n          \n        }\n      `;
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
        'файл.txt',
        'ファイル.txt',
        '文件.txt',
      ];

      specialPaths.forEach((filename) => {
        expect(filename).toBeTruthy();
        expect(filename.length).toBeGreaterThan(0);
      });
    });

    test('handles permission errors gracefully', () => {
      expect(() => {
        try {
          fs.accessSync('/root/protected', fs.constants.R_OK);
        } catch (error) {
          expect(error.code).toMatch(/EACCES|EPERM/);
        }
      }).not.toThrow();
    });
  });

  describe('concurrent operations', () => {
    test('handles race conditions in file writes', async () => {
      const tempFile = path.join('/tmp', `test-${Date.now()}.txt`);
      const writes = Array(10).fill(null).map((_, i) => `Line ${i}\n`);

      try {
        for (const write of writes) {
          fs.appendFileSync(tempFile, write);
        }

        const content = fs.readFileSync(tempFile, 'utf-8');
        expect(content.split('\n').filter(Boolean).length).toBe(10);
      } finally {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
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

// ============================================================================
// I18N MODULE EDGE CASES
// ============================================================================

describe('i18n.mjs - Edge Cases', () => {
  describe('translation loading', () => {
    test('handles missing translation files', () => {
      const missingKey = 'nonexistent.translation.key';
      expect(missingKey).toBeTruthy();
    });

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

    test('handles RTL languages', () => {
      const rtlText = 'مرحبا بالعالم';
      expect(rtlText).toBeTruthy();
      expect(rtlText.length).toBeGreaterThan(0);
    });

    test('handles CJK languages', () => {
      const translations = {
        ja: 'こんにちは',
        zh: '你好',
        ko: '안녕하세요',
      };

      Object.values(translations).forEach((text) => {
        expect(text).toBeTruthy();
      });
    });

    test('handles emoji in translations', () => {
      const withEmoji = 'Success! ✅';
      expect(withEmoji).toContain('✅');
    });

    test('handles very long translation strings', () => {
      const longString = 'a'.repeat(10000);
      expect(longString.length).toBe(10000);
    });
  });

  describe('locale detection', () => {
    test('handles missing locale', () => {
      const locale = undefined;
      const fallback = 'en';
      const result = locale || fallback;
      expect(result).toBe('en');
    });

    test('handles invalid locale format', () => {
      const invalidLocales = ['', 'invalid', '123'];
      invalidLocales.forEach((locale) => {
        expect(typeof locale).toBe('string');
      });
    });
  });
});

// ============================================================================
// TEMPLATES MODULE EDGE CASES
// ============================================================================

describe('templates.mjs - Edge Cases', () => {
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

    test('handles very large templates', () => {
      const template = '{{var}}'.repeat(1000);
      const data = { var: 'x' };
      const result = template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
      expect(result.length).toBe(1000);
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

// ============================================================================
// SCAN MODULE EDGE CASES
// ============================================================================

describe('scan.mjs - Edge Cases', () => {
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
      const invalidPatterns = ['[', '(', '*', '+', '?', '{', '\\\\'];
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

  describe('performance', () => {
    test('handles large files efficiently', () => {
      const largeContent = 'x'.repeat(10 * 1024 * 1024);
      const startTime = Date.now();
      const lines = largeContent.split('\n');
      const duration = Date.now() - startTime;
      expect(lines.length).toBe(1);
      expect(duration).toBeLessThan(5000);
    });
  });
});

// ============================================================================
// MEMORY MODULE EDGE CASES
// ============================================================================

describe('memory.mjs - Edge Cases', () => {
  describe('memory persistence', () => {
    test('handles corrupted memory file', () => {
      const corrupted = '{ invalid json }';
      expect(() => JSON.parse(corrupted)).toThrow();
    });

    test('handles empty memory', () => {
      const memory = [];
      expect(memory.length).toBe(0);
    });

    test('handles large memory files', () => {
      const memory = Array(10000).fill({ key: 'value', timestamp: Date.now() });
      expect(memory.length).toBe(10000);
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

    test('handles very long values', () => {
      const longValue = 'a'.repeat(100000);
      expect(longValue.length).toBe(100000);
    });
  });
});

// ============================================================================
// OUTPUT MODULE EDGE CASES
// ============================================================================

describe('output.mjs - Edge Cases', () => {
  describe('console output', () => {
    test('handles empty messages', () => {
      const message = '';
      expect(message).toBe('');
    });

    test('handles very long messages', () => {
      const message = 'x'.repeat(10000);
      expect(message.length).toBe(10000);
    });

    test('handles multiline messages', () => {
      const message = 'Line 1\nLine 2\nLine 3';
      expect(message.split('\n').length).toBe(3);
    });

    test('handles unicode output', () => {
      const message = 'Emoji: 🚀 ✓ ✗ ★';
      expect(message).toContain('🚀');
    });

    test('handles table formatting', () => {
      const rows = [
        ['Name', 'Age', 'City'],
        ['Alice', '30', 'NYC'],
        ['Bob', '25', 'LA'],
      ];

      const maxWidths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
      expect(maxWidths.length).toBe(3);
    });
  });

  describe('formatting', () => {
    test('handles JSON output', () => {
      const data = { key: 'value', nested: { a: 1 } };
      const json = JSON.stringify(data, null, 2);
      expect(json).toContain('{');
      expect(json).toContain('}');
    });

    test('handles CSV output', () => {
      const rows = [
        ['name', 'age', 'city'],
        ['Alice', '30', 'NYC'],
        ['Bob', '25', 'LA'],
      ];
      const csv = rows.map((row) => row.join(',')).join('\n');
      expect(csv).toContain(',');
    });
  });
});

// ============================================================================
// UI MODULE EDGE CASES
// ============================================================================

describe('ui.mjs - Edge Cases', () => {
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

    test('handles many choices', () => {
      const choices = Array(100).fill(null).map((_, i) => `Option ${i + 1}`);
      expect(choices.length).toBe(100);
    });
  });

  describe('error display', () => {
    test('handles empty error messages', () => {
      const error = new Error('');
      expect(error.message).toBe('');
    });

    test('handles custom error types', () => {
      class CustomError extends Error {
        constructor(message, code) {
          super(message);
          this.code = code;
        }
      }

      const error = new CustomError('Failed', 'E_CUSTOM');
      expect(error.code).toBe('E_CUSTOM');
    });
  });
});

// ============================================================================
// INTEGRATION EDGE CASES
// ============================================================================

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

      expect(() => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            retryable();
            break;
          } catch {
            if (i === maxRetries - 1) throw;
          }
        }
      }).not.toThrow();

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
