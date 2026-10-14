import { useTranslation } from 'react-i18next';

import { changeLanguage } from './i18n';
import { directionOf, isLanguage, type Language } from './languages';

export function useLanguage() {
  const { i18n } = useTranslation();
  const language: Language = isLanguage(i18n.language) ? i18n.language : 'en';
  return {
    language,
    dir: directionOf(language),
    setLanguage: changeLanguage,
  };
}
