import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  calculate,
  type CalculationLink,
  decodeCalculation,
  encodeCalculation,
} from '@/features/calc-engine';
import { standardInput } from '@/features/calc-engine/fixtures';
import { ResultPage } from '@/pages/ResultPage';

import { HistoryView } from './HistoryView';
import { exportHistory, listSaved, saveCalculation } from './storage';

const ratesPayload = {
  rates: {
    USD: { rate: 3.074, lastUpdate: '2026-10-13T12:20:03Z' },
    EUR: { rate: 3.4393, lastUpdate: '2026-10-13T12:20:03Z' },
  },
  source: 'boi',
};

function ratesApi(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof fetch>()
      .mockImplementation(async () => Response.json(body, { status })),
  );
}

const link: CalculationLink = {
  v: 1,
  input: standardInput(),
  rates: { source: 'manual' },
};

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.search}</output>;
}

function renderAt(path: string, resultElement = <LocationProbe />) {
  const router = createMemoryRouter(
    [
      { path: '/history', element: <HistoryView /> },
      { path: '/result', element: resultElement },
      { path: '/calculator', element: <p>calculator</p> },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

const decodedLocation = () =>
  decodeCalculation(
    new URLSearchParams(screen.getByTestId('location').textContent!).get('c')!,
  );

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('HistoryView', () => {
  it('shows the empty state', () => {
    ratesApi(ratesPayload);
    renderAt('/history');
    expect(screen.getByText('No Saved Calculations yet')).toBeInTheDocument();
  });

  it('shows the frozen total and opens the Result', async () => {
    ratesApi(ratesPayload);
    const totals = calculate(link.input).totals;
    saveCalculation(link, { ...totals, totalIncludingVat: 1234.5 });
    renderAt('/history');
    expect(screen.getByText('₪1,234.50')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('link', { name: 'Open' }));
    });
    expect(decodedLocation()).toEqual(link);
  });

  it('recalculates with the current rates', async () => {
    ratesApi(ratesPayload);
    saveCalculation(link, calculate(link.input).totals);
    renderAt('/history');
    const button = screen.getByRole('button', {
      name: "Recalculate with today's rates",
    });
    await waitFor(() => expect(button).toBeEnabled());
    await act(async () => {
      fireEvent.click(button);
    });
    expect(decodedLocation()).toMatchObject({
      input: { rates: { USD: 3.074, EUR: 3.4393 } },
      rates: { source: 'live', lastUpdate: '2026-10-13T12:20:03Z' },
    });
  });

  it('disables Recalculate when rates are unavailable', async () => {
    ratesApi({}, 502);
    saveCalculation(link, calculate(link.input).totals);
    renderAt('/history');
    await screen.findByText(/Recalculate is disabled/);
    expect(
      screen.getByRole('button', { name: "Recalculate with today's rates" }),
    ).toBeDisabled();
  });

  it('deletes one and clears all after confirm', async () => {
    ratesApi(ratesPayload);
    const totals = calculate(link.input).totals;
    saveCalculation(link, totals);
    saveCalculation({ ...link, rates: { source: 'cached' } }, totals);
    renderAt('/history');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('button', { name: /Delete this/ })[0]);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Clear History' }));
    fireEvent.click(
      within(screen.getByRole('alertdialog')).getByRole('button', {
        name: 'Clear',
      }),
    );
    expect(screen.getByText('No Saved Calculations yet')).toBeInTheDocument();
    expect(listSaved()).toEqual([]);
  });

  it('imports a History file and reports counts', async () => {
    ratesApi(ratesPayload);
    saveCalculation(link, calculate(link.input).totals);
    const file = exportHistory();
    localStorage.clear();
    renderAt('/history');

    await act(async () => {
      fireEvent.change(screen.getByTestId('history-import'), {
        target: { files: [new File([file], 'h.json')] },
      });
    });
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Imported 1, skipped 0',
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    await act(async () => {
      fireEvent.change(screen.getByTestId('history-import'), {
        target: { files: [new File(['nope'], 'h.json')] },
      });
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'not an Import Calculator History export',
    );
  });
});

describe('Result Save', () => {
  it('saves once and stays Saved after reopening the link', () => {
    const router = renderAt(
      `/result?c=${encodeCalculation(link)}`,
      <ResultPage />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('button', { name: 'Saved' })).toBeDisabled();
    expect(listSaved()).toHaveLength(1);

    router.dispose();
    cleanup();
    renderAt(`/result?c=${encodeCalculation(link)}`, <ResultPage />);
    expect(screen.getByRole('button', { name: 'Saved' })).toBeDisabled();
  });
});
