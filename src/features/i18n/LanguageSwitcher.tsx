import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from './languages';
import { useLanguage } from './useLanguage';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t('settings.language')}</span>
      <select
        className="rounded-md border bg-background px-2 py-1"
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
    </label>
  );
}
