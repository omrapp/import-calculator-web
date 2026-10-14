export const THEMES = ['system', 'light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];
export type ResolvedTheme = Exclude<Theme, 'system'>;

/** Also read by the pre-paint script in index.html; keep both in sync. */
export const STORAGE_KEY = 'theme';

/** Browser chrome colour per theme; matches `--background` in index.css. */
export const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: '#f8fafd',
  dark: '#0b1423',
};

const DARK_QUERY = '(prefers-color-scheme: dark)';

export const isTheme = (value: unknown): value is Theme =>
  THEMES.includes(value as Theme);

/** The theme after this one, for a single cycling toggle. */
export const nextTheme = (theme: Theme): Theme =>
  THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

export function readSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isTheme(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode, blocked); the choice lasts this visit only.
  }
}

const systemPrefersDark = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia(DARK_QUERY).matches;

export const resolveTheme = (
  theme: Theme,
  prefersDark = systemPrefersDark(),
): ResolvedTheme =>
  theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

function applyToDocument(resolved: ResolvedTheme, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    // Cross-fade colours for one switch only; never on first paint.
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 300);
  }
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[resolved]);
}

let current: Theme = 'system';
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());

export function getTheme(): Theme {
  return current;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setTheme(theme: Theme) {
  current = theme;
  saveTheme(theme);
  applyToDocument(resolveTheme(theme), true);
  notify();
}

/** Applies the saved theme and follows the OS while the choice is "system". */
export function initTheme(theme: Theme = readSavedTheme()) {
  current = theme;
  applyToDocument(resolveTheme(theme), false);
  if (typeof window.matchMedia !== 'function') return;
  window.matchMedia(DARK_QUERY).addEventListener('change', event => {
    if (current !== 'system') return;
    applyToDocument(resolveTheme('system', event.matches), true);
    notify();
  });
}
