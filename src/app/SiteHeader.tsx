import * as m from 'motion/react-m';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { Logo } from '@/components/brand';
import { LanguageSwitcher } from '@/features/i18n';
import { ThemeToggle } from '@/features/theme';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { MobileNav } from './MobileNav';
import { headerNav } from './nav';

/** Header height at rest and once the page scrolls; the spacer keeps the larger one. */
export const HEADER_HEIGHT = 'h-16';

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);
  return scrolled;
}

/**
 * Fixed glass bar. It is transparent at the top of the page and gains a
 * surface, border and shadow once content scrolls under it; it shrinks
 * 64 → 56px without moving the page, because it is out of flow.
 */
export function SiteHeader() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const scrolled = useScrolled();

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 ease-out-quart print:hidden',
          scrolled
            ? 'border-border/70 bg-surface-glass shadow-md backdrop-blur-lg backdrop-saturate-150'
            : 'border-transparent bg-transparent',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-page items-center gap-4 px-4 transition-[height] duration-200 ease-out-quart sm:px-6',
            scrolled ? 'h-14' : 'h-16',
          )}
        >
          <Link
            to="/"
            aria-label={t('nav.home')}
            className="-ms-1 rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo />
          </Link>

          <nav aria-label={t('nav.main')} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {headerNav.map(({ path, titleKey, activeOn }) => {
                const active = (activeOn as readonly string[]).includes(
                  pathname,
                );
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring',
                        active
                          ? 'text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {active && (
                        <m.span
                          layoutId="header-nav-pill"
                          transition={spring.indicator}
                          className="absolute inset-0 rounded-full bg-accent ring-1 ring-highlight/25 ring-inset"
                        />
                      )}
                      <span className="relative">{t(titleKey)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-1">
            <LanguageSwitcher className="hidden sm:flex" />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>
      <div aria-hidden className={cn(HEADER_HEIGHT, 'shrink-0 print:hidden')} />
    </>
  );
}
