import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Logo } from '@/components/brand';
import { CONTACT_EMAIL } from '@/features/site-pages/content/types';

import { footerNav, primaryNav } from './nav';

const LINK =
  'rounded-sm text-footer-muted transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight';

function Column({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-white">{heading}</h2>
      {children}
    </div>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer text-sm text-footer-foreground print:hidden">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            aria-label={t('nav.home')}
            className="w-fit rounded-lg text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
          >
            <Logo />
          </Link>
          <p className="max-w-xs text-footer-muted">{t('footer.tagline')}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={`${LINK} inline-flex w-fit items-center gap-2`}
          >
            <Mail className="size-4" aria-hidden />
            <bdi dir="ltr">{CONTACT_EMAIL}</bdi>
          </a>
        </div>

        <Column heading={t('nav.tools')}>
          <nav aria-label={t('nav.tools')}>
            <ul className="flex flex-col gap-2">
              {primaryNav.map(({ path, titleKey }) => (
                <li key={path}>
                  <Link to={path} className={LINK}>
                    {t(titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Column>

        <Column heading={t('nav.information')}>
          <nav aria-label={t('nav.footer')}>
            <ul className="flex flex-col gap-2">
              {footerNav.map(({ path, titleKey }) => (
                <li key={path}>
                  <Link to={path} className={LINK}>
                    {t(titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Column>

        <Column heading={t('footer.data_heading')}>
          <p className="flex items-start gap-2 text-footer-muted">
            <span
              aria-hidden
              className="mt-1.5 size-2 shrink-0 animate-live-dot rounded-full bg-highlight"
            />
            {t('footer.rates_note')}
          </p>
          <p className="text-footer-muted">{t('pages.estimate_only')}</p>
        </Column>
      </div>

      <div className="border-t border-footer-border">
        <div className="mx-auto flex max-w-page flex-col gap-1 px-4 py-5 text-xs text-footer-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t('footer.rights', { year })}</p>
          <p>
            <bdi dir="ltr">v{__APP_VERSION__}</bdi>
          </p>
        </div>
      </div>
    </footer>
  );
}
