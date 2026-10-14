import { isLanguage, type Language, STORAGE_KEY } from './languages';

export function readSavedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLanguage(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage unavailable (private mode, blocked); the choice lasts this visit only.
  }
}

/** Query parameter for language links (`?lang=he`), used by hreflang URLs. */
export const LANGUAGE_PARAM = 'lang';

/**
 * Reads `?lang=` from the address bar, saves it, and removes it from the URL
 * so a shared link does not pin the receiver's language.
 */
export function consumeLanguageParam(): Language | null {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(LANGUAGE_PARAM);
  if (value === null) return null;
  url.searchParams.delete(LANGUAGE_PARAM);
  window.history.replaceState(window.history.state, '', url);
  if (!isLanguage(value)) return null;
  saveLanguage(value);
  return value;
}

/** `?lang=` → saved choice → first supported browser language → English. */
export function detectLanguage(
  browserLanguages: readonly string[] = navigator.languages,
): Language {
  const fromUrl = consumeLanguageParam();
  if (fromUrl) return fromUrl;
  const saved = readSavedLanguage();
  if (saved) return saved;
  for (const tag of browserLanguages) {
    const base = tag.toLowerCase().split('-')[0];
    // Legacy code some browsers still report for Hebrew.
    const language = base === 'iw' ? 'he' : base;
    if (isLanguage(language)) return language;
  }
  return 'en';
}
