import type { RouteObject } from 'react-router';

import { AppLayout } from '@/app/AppLayout';
import { navItems } from '@/app/nav';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      ...navItems.map(({ path, titleKey }) => ({
        path,
        element: <PlaceholderPage titleKey={titleKey} />,
      })),
      { path: '/result', element: <PlaceholderPage titleKey="nav.result" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
