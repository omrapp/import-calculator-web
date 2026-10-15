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
});
