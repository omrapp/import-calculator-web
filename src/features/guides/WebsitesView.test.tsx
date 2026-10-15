import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { WebsitesView } from './WebsitesView';

function renderWebsites() {
  const router = createMemoryRouter(
    [{ path: '/websites', element: <WebsitesView /> }],
    { initialEntries: ['/websites'] },
  );
  render(<RouterProvider router={router} />);
}

describe('WebsitesView', () => {
  it('opens websites in a new tab without opener access', () => {
    renderWebsites();
    const link = within(screen.getByText('WeChat').closest('li')!).getByRole(
      'link',
      { name: /Visit Website/ },
    );
    expect(link).toHaveAttribute('href', 'https://www.wechat.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('groups websites by category and filters by one', () => {
    renderWebsites();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Government & Customs' }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: /^Shipping & Logistics/ }),
    );
    expect(
      screen.getByRole('button', { name: /^Shipping & Logistics/ }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Government & Customs' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Tevel Logistics')).toBeInTheDocument();
  });

  it('filters by search and shows an empty state', () => {
    renderWebsites();
    const search = screen.getByRole('searchbox', { name: 'Search websites' });
    fireEvent.change(search, { target: { value: 'wechat' } });
    expect(screen.getByText('WeChat')).toBeInTheDocument();
    expect(screen.queryByText('Tevel Logistics')).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: 'no such site at all' } });
    expect(
      screen.getByText('Nothing matches your search.'),
    ).toBeInTheDocument();
  });

  it('filters by a tag chip, matches tags in search and clears the tag', () => {
    renderWebsites();
    const card = screen.getByText('IndiaMART').closest('li')!;
    fireEvent.click(within(card).getByRole('button', { name: 'India' }));
    expect(screen.getByText('IndiaMART')).toBeInTheDocument();
    expect(screen.queryByText('Alibaba.com')).not.toBeInTheDocument();
    expect(screen.getByText('Filtered by tag: India')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear tag filter' }));
    expect(screen.getByText('Alibaba.com')).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search websites' }),
      {
        target: { value: 'dropshipping' },
      },
    );
    expect(screen.getByText('Wholesale2B')).toBeInTheDocument();
    expect(screen.getByText('ZIK Analytics')).toBeInTheDocument();
    expect(screen.queryByText('Alibaba.com')).not.toBeInTheDocument();
  });

  it('shows a homepage screenshot when one was captured, else the generated art', () => {
    renderWebsites();
    const wechat = screen.getByText('WeChat').closest('li')!;
    expect(wechat.querySelector('img[src="/sites/2.webp"]')).not.toBeNull();
    // gov.il blocks headless capture, so this card keeps the category art.
    const guide = screen.getByText('Personal Import Guide').closest('li')!;
    expect(guide.querySelector('img[src^="/sites/"]')).toBeNull();
    expect(
      wechat.querySelector('img[src*="google.com/s2/favicons"]'),
    ).toHaveAttribute('referrerpolicy', 'no-referrer');
    // No favicon for ExpoExpo anywhere, so its card shows the monogram.
    const expo = screen.getByText('ExpoExpo').closest('li')!;
    expect(expo.querySelector('img[src*="favicons"]')).toBeNull();
    expect(within(expo).getByText('E')).toBeInTheDocument();
  });
});
