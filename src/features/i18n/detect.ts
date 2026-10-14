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

/** Saved choice → first supported browser language → English. */
export function detectLanguage(
  browserLanguages: readonly string[] = navigator.languages,
): Language {
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
