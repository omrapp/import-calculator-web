import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '@/app/routes';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

describe('routes', () => {
  it.each([
    ['/', 'Standard Calculation'],
    ['/air-shipment', 'Air Shipment Calculation'],
    ['/result', 'Result'],
    ['/history', 'History'],
    ['/guides', 'Guides'],
    ['/settings', 'Settings'],
    ['/about', 'About Us'],
    ['/contact', 'Contact Us'],
    ['/privacy', 'Privacy Policy'],
    ['/terms', 'Terms of Use'],
  ])('renders %s', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
  });

  it('renders not found for unknown paths', () => {
    renderAt('/nope');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Page not found',
    );
  });
});
