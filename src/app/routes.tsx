import type { RouteObject } from 'react-router';

import { AppLayout, PageFallback } from '@/app/AppLayout';
import type { RouteHandle } from '@/app/seo';

/** One lazily loaded page per route, so each page is its own chunk. */
const page = (
  path: string,
  handle: RouteHandle,
  load: () => Promise<React.ComponentType>,
): RouteObject => ({
  path,
  handle,
  lazy: async () => ({ Component: await load() }),
});

export const routes: RouteObject[] = [
  {
    Component: AppLayout,
    HydrateFallback: PageFallback,
    children: [
      page(
        '/',
        {
          titleKey: 'nav.standard',
          descriptionKey: 'seo.description.standard',
        },
        () =>
          import('@/pages/StandardCalculationPage').then(
            m => m.StandardCalculationPage,
          ),
      ),
      page(
        '/air-shipment',
        { titleKey: 'nav.air_shipment', descriptionKey: 'seo.description.air' },
        () =>
          import('@/pages/AirShipmentCalculationPage').then(
            m => m.AirShipmentCalculationPage,
          ),
      ),
      page('/result', { titleKey: 'nav.result', noindex: true }, () =>
        import('@/pages/ResultPage').then(m => m.ResultPage),
      ),
      page(
        '/history',
        { titleKey: 'nav.history', descriptionKey: 'seo.description.history' },
        () => import('@/pages/HistoryPage').then(m => m.HistoryPage),
      ),
      page(
        '/guides',
        { titleKey: 'nav.guides', descriptionKey: 'seo.description.guides' },
        () => import('@/pages/GuidesPage').then(m => m.GuidesPage),
      ),
      page('/settings', { titleKey: 'nav.settings' }, () =>
        import('@/pages/SettingsPage').then(m => m.SettingsPage),
      ),
      page(
        '/about',
        { titleKey: 'nav.about', descriptionKey: 'seo.description.about' },
        () => import('@/pages/AboutPage').then(m => m.AboutPage),
      ),
      page(
        '/contact',
        { titleKey: 'nav.contact', descriptionKey: 'seo.description.contact' },
        () => import('@/pages/ContactPage').then(m => m.ContactPage),
      ),
      page('/privacy', { titleKey: 'nav.privacy' }, () =>
        import('@/pages/PrivacyPage').then(m => m.PrivacyPage),
      ),
      page('/terms', { titleKey: 'nav.terms' }, () =>
        import('@/pages/TermsPage').then(m => m.TermsPage),
      ),
      page('*', { titleKey: 'pages.not_found', noindex: true }, () =>
        import('@/pages/NotFoundPage').then(m => m.NotFoundPage),
      ),
    ],
  },
];
