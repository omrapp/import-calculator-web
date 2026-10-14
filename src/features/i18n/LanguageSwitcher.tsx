import { ChevronDown, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import { SUPPORTED_LANGUAGES } from './languages';
import { useLanguage } from './useLanguage';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <label
      className={cn(
        'relative flex h-10 items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors duration-150 focus-within:ring-2 focus-within:ring-ring hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      <span className="sr-only">{t('settings.language')}</span>
      <Languages
        aria-hidden
        className="pointer-events-none absolute start-2.5 size-4"
      />
      <select
        className="h-full cursor-pointer appearance-none rounded-lg bg-transparent ps-8 pe-7 outline-none"
        value={language}
        onChange={event => {
          const next = SUPPORTED_LANGUAGES.find(l => l === event.target.value);
          if (next) void setLanguage(next);
        }}
      >
        {SUPPORTED_LANGUAGES.map(code => (
          <option key={code} value={code}>
            {t(`settings.languages.${code}`)}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute end-2 size-3.5"
      />
    </label>
  );
}
