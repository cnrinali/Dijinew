// Supported Languages Configuration
export const LANGUAGES = {
  TR: { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
  EN: { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', rtl: false },
  AR: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  RU: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  PT: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false }
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);

export const DEFAULT_LANGUAGE = 'tr';

export const isValidLanguage = (langCode) => {
  return LANGUAGE_LIST.some(lang => lang.code === langCode);
};

export const getLanguage = (langCode) => {
  return LANGUAGE_LIST.find(lang => lang.code === langCode) || LANGUAGES.TR;
};

export const getLanguageByCode = (code) => {
  const lang = LANGUAGE_LIST.find(l => l.code === code);
  return lang || LANGUAGES.TR;
};
