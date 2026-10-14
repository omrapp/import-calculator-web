import type { RouteObject } from 'react-router';

import { AppLayout } from '@/app/AppLayout';
import { navItems } from '@/app/nav';
import { AirShipmentCalculationPage } from '@/pages/AirShipmentCalculationPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { StandardCalculationPage } from '@/pages/StandardCalculationPage';

const pages: Partial<Record<string, React.ReactNode>> = {
  '/': <StandardCalculationPage />,
  '/air-shipment': <AirShipmentCalculationPage />,
};

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      ...navItems.map(({ path, titleKey }) => ({
        path,
        element: pages[path] ?? <PlaceholderPage titleKey={titleKey} />,
      })),
      { path: '/result', element: <PlaceholderPage titleKey="nav.result" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
