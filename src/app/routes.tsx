import type { RouteObject } from 'react-router';

import { AppLayout } from '@/app/AppLayout';
import { navItems } from '@/app/nav';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      ...navItems.map(({ path, title }) => ({
        path,
        element: <PlaceholderPage title={title} />,
      })),
      { path: '/result', element: <PlaceholderPage title="Result" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
