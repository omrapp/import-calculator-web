import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { HomeView } from './HomeView';

describe('Home', () => {
  it('sends the hero and closing calls to action to the calculators', () => {
    render(<HomeView />, { wrapper: MemoryRouter });
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Know your landed cost before you import.',
      }),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole('link', {
      name: /Start calculating/,
    })) {
      expect(link).toHaveAttribute('href', '/calculator');
    }
    expect(screen.getByRole('link', { name: 'Air shipment' })).toHaveAttribute(
      'href',
      '/air-shipment',
    );
  });

  it('describes the features and steps, and links to Guides and Websites', () => {
    render(<HomeView />, { wrapper: MemoryRouter });
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6 + 3);
    expect(
      screen.getByRole('link', { name: /Read the guides/ }),
    ).toHaveAttribute('href', '/guides');
    expect(
      screen.getByRole('link', { name: /Browse websites/ }),
    ).toHaveAttribute('href', '/websites');
  });

  it('shows the sea and air cards, the routes map and shipping photos', () => {
    const { container } = render(<HomeView />, { wrapper: MemoryRouter });
    expect(
      screen.getByRole('link', { name: /Sea freight & any shipment/ }),
    ).toHaveAttribute('href', '/calculator');
    expect(screen.getByRole('link', { name: /Air cargo/ })).toHaveAttribute(
      'href',
      '/air-shipment',
    );
    expect(
      screen.getByRole('img', { name: /main sea and air freight routes/ }),
    ).toBeInTheDocument();
    const hero = container.querySelector<HTMLImageElement>(
      'img[src="/photos/ship-entering-port-1600.webp"]',
    );
    expect(hero).toHaveAttribute('loading', 'eager');
    // Photos are decorative; the text over them carries the meaning.
    expect(hero).toHaveAttribute('alt', '');
  });
});
