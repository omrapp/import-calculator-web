import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from '@/locales/ar.json';
import en from '@/locales/en.json';
import he from '@/locales/he.json';

import { detectLanguage, saveLanguage } from './detect';
import { directionOf, type Language, SUPPORTED_LANGUAGES } from './languages';

function applyToDocument(language: Language) {
  document.documentElement.lang = language;
  document.documentElement.dir = directionOf(language);
}

export function initI18n(language: Language = detectLanguage()) {
  applyToDocument(language);
  return i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      he: { translation: he },
      ar: { translation: ar },
    },
    lng: language,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
    initAsync: false,
  });
}

export async function changeLanguage(language: Language) {
  await i18n.changeLanguage(language);
  applyToDocument(language);
  saveLanguage(language);
}

export { i18n };
