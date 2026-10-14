import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { routes } from '@/app/routes';
import { changeLanguage } from '@/features/i18n';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

afterEach(async () => {
  await changeLanguage('en');
});

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
  ])('renders %s', async (path, title) => {
    renderAt(path);
    expect(
      await screen.findByRole('heading', { level: 1 }, { timeout: 12_000 }),
    ).toHaveTextContent(title);
  });

  it('renders not found for unknown paths', async () => {
    renderAt('/nope');
    expect(
      await screen.findByRole('heading', { level: 1 }, { timeout: 12_000 }),
    ).toHaveTextContent('Page not found');
  });
});

describe('page title', () => {
  it('follows the route and the language', async () => {
    const router = renderAt('/about');
    await waitFor(() =>
      expect(document.title).toBe('About Us — Import Calculator'),
    );
    await act(() => router.navigate('/contact'));
    await waitFor(() =>
      expect(document.title).toBe('Contact Us — Import Calculator'),
    );
    await act(() => changeLanguage('he'));
    await waitFor(() => expect(document.title).toBe('צור קשר — מחשבון יבוא'));
  });
});

describe('layout', () => {
  it('opens the mobile menu and closes it after choosing a page', async () => {
    const router = renderAt('/about');
    await screen.findByRole('heading', { level: 1 });
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const menu = screen.getByRole('dialog');
    await act(async () => {
      fireEvent.click(within(menu).getByRole('link', { name: 'History' }));
    });
    expect(router.state.location.pathname).toBe('/history');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('links the site pages from the footer', async () => {
    renderAt('/about');
    await screen.findByRole('heading', { level: 1 });
    const footer = within(
      screen.getByRole('navigation', { name: 'Site information' }),
    );
    for (const name of [
      'About Us',
      'Contact Us',
      'Privacy Policy',
      'Terms of Use',
      'Settings',
    ]) {
      expect(footer.getByRole('link', { name })).toBeInTheDocument();
    }
  });
});
