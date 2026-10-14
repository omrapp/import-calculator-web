export const SUPPORTED_LANGUAGES = ['en', 'he', 'ar'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: readonly Language[] = ['he', 'ar'];

export const STORAGE_KEY = 'language';

export const isLanguage = (value: unknown): value is Language =>
  SUPPORTED_LANGUAGES.includes(value as Language);

export const directionOf = (language: Language): 'ltr' | 'rtl' =>
  RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
