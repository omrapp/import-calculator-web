import { Analytics } from '@vercel/analytics/react';
import { Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router';

import { LanguageSwitcher } from '@/features/i18n';
import { cn } from '@/lib/utils';

import { MobileNav } from './MobileNav';
import { primaryNav } from './nav';
import { SiteFooter } from './SiteFooter';
import { usePageTitle } from './usePageTitle';

export function AppLayout() {
  const { t } = useTranslation();
  usePageTitle();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Calculator className="size-5" />
            {t('home.title')}
          </Link>
          <nav
            aria-label={t('nav.main')}
            className="hidden flex-1 flex-wrap gap-x-4 gap-y-2 text-sm md:flex"
          >
            {primaryNav.map(({ path, titleKey }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  cn(
                    'text-muted-foreground hover:text-foreground',
                    isActive && 'font-medium text-foreground',
                  )
                }
              >
                {t(titleKey)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <SiteFooter />
      <Analytics />
    </div>
  );
}

/** Shown while the first lazy page loads. */
export function PageFallback() {
  return <div className="min-h-svh" aria-busy="true" />;
}
