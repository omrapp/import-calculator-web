import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { footerNav } from './nav';

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground">
        <nav
          aria-label={t('nav.footer')}
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {footerNav.map(({ path, titleKey }) => (
            <Link key={path} to={path} className="hover:text-foreground">
              {t(titleKey)}
            </Link>
          ))}
        </nav>
        <p>{t('pages.estimate_only')}</p>
      </div>
    </footer>
  );
}
