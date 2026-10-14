import { Analytics } from '@vercel/analytics/react';

import { MotionProvider, PageTransition } from '@/components/motion';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { usePageTitle } from './usePageTitle';

export function AppLayout() {
  usePageTitle();

  return (
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
  );
}

/** Shown while the first lazy page loads. */
export function PageFallback() {
  return <div className="min-h-svh" aria-busy="true" />;
}
