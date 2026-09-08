import { ui } from './ui.mjs';

const LOCALES = {
  en: { name: 'English', dir: 'ltr' },
  fr: { name: 'Franç·ªis', dir: 'ltr' },
  es: { name: 'Espa√√ol', dir: 'ltr' },
  de: { name: 'Deutsch', dir: 'ltr' },
  ja: { name: 'Ê£≠Ê£≠Ë™×¬≠', dir: 'ltr' },
  zh: { name: '‰∏≠Ê£ñ¢¬®', dir: 'ltr' },
  ar: { name: 'ÿß·Ñ¢ÿÆ·Ñ¢ÿ≥ÿ≠', dir: 'rtl' }
};

export function getLocale(locale) {
  if (!locale) {
    return { locale: 'en', ...LOCALES.en };
  }

  const base = locale.split('-')[0].toLowerCase();
  if (LOCALES[base]) {
    return { locale: base, ...LOCALES[base] };
  }

  return { locale: 'en', ...LOCALES.en };
}

export function t(key, params = {}, locale = 'en') {
  if (!key) {
    return '';
  }

  const translations = {
    en: {
      'welcome': 'Welcome',
      'error': 'Error',
      'success': 'Success',
      'loading': 'Loading...',
      'unsupported_locale': 'Unsupported locale: {locale}'
    },
    fr: {
      'welcome': 'Bienvenue',
      'error': 'Erreur',
      'success': 'Succ√™s',
      'loading': 'Chargement...',
      'unsupported_locale': 'Locale non prise en charge: {locale}'
    }
  };

  const dict = translations[locale] || translations.en;
  let text = dict[key] || key;

  if (params) {
    Object.keys(params).forEach(k => {
      text = text.replace(`{${k}}`, params[k]);
    });
  }

  return text;
}
