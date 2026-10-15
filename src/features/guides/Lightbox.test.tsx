import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { changeLanguage } from '@/features/i18n';

import { GuidesView } from './GuidesView';

function renderPresentation() {
  const router = createMemoryRouter(
    [{ path: '/guides', element: <GuidesView /> }],
    { initialEntries: ['/guides?tab=presentation'] },
  );
  render(<RouterProvider router={router} />);
}

const position = () => screen.getByTestId('lightbox-position').textContent;
const dialog = () => screen.getByRole('dialog');

afterEach(async () => {
  await changeLanguage('en');
});

describe('Lightbox', () => {
  it('opens on the clicked slide and moves with buttons and arrow keys', () => {
    renderPresentation();
    fireEvent.click(screen.getByRole('button', { name: /Import System/ }));
    expect(position()).toBe('2 / 22');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(position()).toBe('3 / 22');
    fireEvent.keyDown(dialog(), { key: 'ArrowLeft' });
    fireEvent.keyDown(dialog(), { key: 'ArrowLeft' });
    expect(position()).toBe('1 / 22');
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(position()).toBe('22 / 22');
  });

  it('follows reading direction in RTL', async () => {
    await changeLanguage('he');
    renderPresentation();
    fireEvent.click(screen.getAllByRole('button', { name: /1 \/ 22/ })[0]);
    fireEvent.keyDown(dialog(), { key: 'ArrowLeft' });
    expect(position()).toBe('2 / 22');
  });

  it('zooms in, resets and closes with Escape', () => {
    renderPresentation();
    fireEvent.click(screen.getByRole('button', { name: /Import Guide/ }));
    const image = () => dialog().querySelector('img')!;
    expect(image().style.width).toBe('100%');

    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(image().style.width).toBe('150%');
    fireEvent.click(screen.getByRole('button', { name: 'Reset zoom' }));
    expect(image().style.width).toBe('100%');

    fireEvent.keyDown(dialog(), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('offers the full-size file for the documents in the guides', () => {
    const router = createMemoryRouter(
      [{ path: '/guides', element: <GuidesView /> }],
      { initialEntries: ['/guides'] },
    );
    render(<RouterProvider router={router} />);
    fireEvent.click(
      screen.getAllByRole('button', { name: /Certificate of Origin/ })[0],
    );
    expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute(
      'href',
      '/guides/coo-full.webp',
    );
  });
});
