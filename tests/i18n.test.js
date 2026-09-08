import { describe, it, expect } from '@jest/globals';
import { initializeI18n, setLocale, getLocale, getSupportedLocales, t, isYes, isNo } from '../cli/lib/i18n.mjs';

describe('I18n Commands', () => {
  it('should return supported locales', () => {
    const locales = getSupportedLocales();
    expect(locales).toContain('en');
    expect(locales).toContain('fr');
    expect(locales).toContain('es');
  });

  it('should set and get locale', () => {
    setLocale('fr');
    expect(getLocale()).toBe('fr');
  });

  it('should translate messages', () => {
    setLocale('en');
    expect(t('success.install')).toBe('Installation complete');
    
    setLocale('fr');
    expect(t('success.install')).not.toBe('Installation complete');
  });

  it('should detect yes in multiple languages', () => {
    expect(isYes('y')).toBe(true);
    expect(isYes('yes')).toBe(true);
    expect(isYes('oui')).toBe(true);
    expect(isYes('sí¹´')).toBe(true);
    expect(isYes('ja')).toBe(true);
  });

  it('should detect no in multiple languages', () => {
    expect(isNo('n')).toBe(true);
    expect(isNo('no')).toBe(true);
    expect(isNo('non')).toBe(true);
    expect(isNo('nein')).toBe(true);
  });
});
