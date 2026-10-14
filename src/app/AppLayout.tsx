import { Analytics } from '@vercel/analytics/react';
import { Direction } from 'radix-ui';

import { MotionProvider, PageTransition } from '@/components/motion';
import { useLanguage } from '@/features/i18n';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { useSeo } from './seo';

export function AppLayout() {
  useSeo();
  const { dir } = useLanguage();

  return (
    // Radix tabs, accordions and menus otherwise default to left-to-right.
    <Direction.Provider dir={dir}>
      <MotionProvider>
        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <main className="mx-auto w-full max-w-page flex-1 px-4 pt-4 pb-12 sm:px-6 md:pt-8">
            <PageTransition />
          </main>
          <SiteFooter />
          <Analytics />
        </div>
      </MotionProvider>
    </Direction.Provider>
  );
}

/** Shown while the first lazy page loads. */
export function PageFallback() {
  return <div className="min-h-svh" aria-busy="true" />;
}
