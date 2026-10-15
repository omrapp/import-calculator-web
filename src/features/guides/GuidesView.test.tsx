import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { GuidesView } from './GuidesView';
import { WebsitesView } from './WebsitesView';

function renderGuides(path = '/guides') {
  const router = createMemoryRouter(
    [
      { path: '/guides', element: <GuidesView /> },
      { path: '/websites', element: <WebsitesView /> },
    ],
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
    await openTab('Terms');
    expect(router.state.location.search).toBe('?tab=terms');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('has no Gallery or Websites tabs', () => {
    renderGuides();
    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      'Guides',
      'Presentation',
      'Terms',
    ]);
  });

  it('sends the old Websites tab link to the Websites page', () => {
    const router = renderGuides('/guides?tab=websites');
    expect(router.state.location.pathname).toBe('/websites');
  });

  it('falls back to the guides for the old Gallery tab link', () => {
    renderGuides('/guides?tab=gallery');
    expect(screen.getByRole('tab', { name: 'Guides' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
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
    ).toHaveAttribute('href', '/calculator');
  });
});
