import type { RouteObject } from 'react-router';

import { AppLayout, PageFallback } from '@/app/AppLayout';
import type { RouteHandle } from '@/app/usePageTitle';

/** One lazily loaded page per route, so each page is its own chunk. */
const page = (
  path: string,
  titleKey: string,
  load: () => Promise<React.ComponentType>,
): RouteObject => ({
  path,
  handle: { titleKey } satisfies RouteHandle,
  lazy: async () => ({ Component: await load() }),
});

export const routes: RouteObject[] = [
  {
    Component: AppLayout,
    HydrateFallback: PageFallback,
    children: [
      page('/', 'nav.standard', () =>
        import('@/pages/StandardCalculationPage').then(
          m => m.StandardCalculationPage,
        ),
      ),
      page('/air-shipment', 'nav.air_shipment', () =>
        import('@/pages/AirShipmentCalculationPage').then(
          m => m.AirShipmentCalculationPage,
        ),
      ),
      page('/result', 'nav.result', () =>
        import('@/pages/ResultPage').then(m => m.ResultPage),
      ),
      page('/history', 'nav.history', () =>
        import('@/pages/HistoryPage').then(m => m.HistoryPage),
      ),
      page('/guides', 'nav.guides', () =>
        import('@/pages/GuidesPage').then(m => m.GuidesPage),
      ),
      page('/settings', 'nav.settings', () =>
        import('@/pages/SettingsPage').then(m => m.SettingsPage),
      ),
      page('/about', 'nav.about', () =>
        import('@/pages/AboutPage').then(m => m.AboutPage),
      ),
      page('/contact', 'nav.contact', () =>
        import('@/pages/ContactPage').then(m => m.ContactPage),
      ),
      page('/privacy', 'nav.privacy', () =>
        import('@/pages/PrivacyPage').then(m => m.PrivacyPage),
      ),
      page('/terms', 'nav.terms', () =>
        import('@/pages/TermsPage').then(m => m.TermsPage),
      ),
      page('*', 'pages.not_found', () =>
        import('@/pages/NotFoundPage').then(m => m.NotFoundPage),
      ),
    ],
  },
];
