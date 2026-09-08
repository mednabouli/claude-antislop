const LOCALES = {
  en: { name: 'English', dir: 'ltr' },
  fr: { name: 'Francais', dir: 'ltr' },
  es: { name: 'Espanol', dir: 'ltr' },
  de: { name: 'Deutsch', dir: 'ltr' },
  ja: { name: 'Nihongo', dir: 'ltr' },
  zh: { name: 'Zhongwen', dir: 'ltr' },
  ar: { name: 'Arabic', dir: 'rtl' }
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
      'success': 'Succes',
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

export function getSupportedLocales() {
  return Object.keys(LOCALES);
}

export function initializeI18n(locale = 'en') {
  return { locale, t: (key, params) => t(key, params, locale) };
}

export function isNo(value) {
  return value === 'no' || value === 'n' || value === false;
}
