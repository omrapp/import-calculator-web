import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { GuidesView } from './GuidesView';

function renderGuides(path = '/guides') {
  const router = createMemoryRouter(
    [{ path: '/guides', element: <GuidesView /> }],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

const search = (value: string) =>
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search guides' }), {
    target: { value },
  });

// Radix tabs activate on mousedown.
const openTab = (name: string) =>
  act(() => {
    fireEvent.mouseDown(screen.getByRole('tab', { name }), { button: 0 });
  });

describe('GuidesView', () => {
  it('opens the tab named in the URL', () => {
    renderGuides('/guides?tab=terms');
    expect(screen.getByRole('tab', { name: 'Terms' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Free on Board')).toBeInTheDocument();
  });

  it('switching tabs updates the URL and clears the search', async () => {
    const router = renderGuides();
    search('import');
    await openTab('Websites');
    expect(router.state.location.search).toBe('?tab=websites');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('filters the active tab and shows an empty state', () => {
    renderGuides('/guides?tab=terms');
    search('FOB');
    expect(screen.getByText('Free on Board')).toBeInTheDocument();
    search('no such term at all');
    expect(
      screen.getByText('Nothing matches your search.'),
    ).toBeInTheDocument();
  });

  it('shows the guides as a documentation page with an index', () => {
    renderGuides();
    const index = screen.getAllByRole('navigation', {
      name: 'On this page',
    })[0];
    expect(
      within(index).getAllByRole('link', {
        name: '1. Personal Import Rules',
      })[0],
    ).toHaveAttribute('href', '#module-1');
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /1\. Personal Import Rules/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Up to $75:')).toBeInTheDocument();
  });

  it('adds a table, diagrams, a chart and callouts to the modules', () => {
    renderGuides();
    expect(
      screen.getByRole('columnheader', { name: 'Customs Duty' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Chargeable weight')).toBeInTheDocument();
    expect(
      screen.getAllByText('Where the money goes: a sample import').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('Important').length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: 'calculator' })[0],
    ).toHaveAttribute('href', '/');
  });

  it('opens websites in a new tab without opener access', () => {
    renderGuides('/guides?tab=websites');
    const link = within(screen.getByText('WeChat').closest('li')!).getByRole(
      'link',
      { name: /Visit Website/ },
    );
    expect(link).toHaveAttribute('href', 'https://www.wechat.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('groups websites by category and filters by one', () => {
    renderGuides('/guides?tab=websites');
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
});
