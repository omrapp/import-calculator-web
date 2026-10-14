import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

import { nextTheme, type Theme } from './theme';
import { useTheme } from './useTheme';

const ICONS: Record<Theme, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const next = nextTheme(theme);
  const Icon = ICONS[theme];

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={t('settings.theme.toggle', {
        current: t(`settings.theme.${theme}`),
        next: t(`settings.theme.${next}`),
      })}
      title={t(`settings.theme.${theme}`)}
    >
      <Icon
        key={theme}
        aria-hidden
        className="animate-in duration-300 ease-out-expo fade-in spin-in-45 zoom-in-75"
      />
    </Button>
  );
}
