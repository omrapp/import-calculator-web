import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  type CalculationInput,
  type CalculationLink,
  decodeCalculation,
  encodeCalculation,
} from '@/features/calc-engine';
import golden from '@/features/calc-engine/__fixtures__/rn-golden.json';
import { CalculatorForm } from '@/features/calculator-ui';

import { ResultView } from './ResultView';

const fixtures = golden as { name: string; input: CalculationInput }[];
const fixture = (name: string) => fixtures.find(f => f.name === name)!.input;

const linkFor = (
  input: CalculationInput,
  rates: CalculationLink['rates'] = {
    source: 'live',
    lastUpdate: '2026-10-13T12:20:03Z',
  },
) => encodeCalculation({ v: 1, input, rates });

function renderResult(search: string) {
  const router = createMemoryRouter(
    [
      { path: '/result', element: <ResultView /> },
      {
        path: '/calculator',
        element: (
          <CalculatorForm
            mode="standard"
            title="Standard"
            defaultTitle="Calculation 1"
          />
        ),
      },
      {
        path: '/air-shipment',
        element: (
          <CalculatorForm
            mode="air-shipment"
            title="Air"
            defaultTitle="Calculation 1"
          />
        ),
      },
    ],
    { initialEntries: [`/result${search}`] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('ResultView', () => {
  it('renames the Calculation and keeps the new title in the link', async () => {
    const router = renderResult(
      `?c=${linkFor(fixture('everything combined'))}`,
    );
    expect(
      screen.getByRole('heading', { name: 'Untitled calculation' }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Edit title and description' }),
    );
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Shoes order' },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
    expect(
      screen.getByRole('heading', { name: 'Shoes order' }),
    ).toBeInTheDocument();
    const c = new URLSearchParams(router.state.location.search).get('c');
    expect(decodeCalculation(c ?? '')?.meta).toEqual({ title: 'Shoes order' });
  });

  it('shows headline totals and every section in order', () => {
    renderResult(`?c=${linkFor(fixture('everything combined'))}`);
    const summary = within(screen.getByRole('region', { name: 'Summary' }));
    expect(summary.getByText('₪111,999.89')).toBeInTheDocument();
    expect(summary.getByText('₪132,159.87')).toBeInTheDocument();
    const breakdown = within(
      screen.getByRole('region', { name: 'Step-by-step breakdown' }),
    );
    expect(
      breakdown.getAllByRole('heading', { level: 3 }).map(h => h.textContent),
    ).toEqual([
      'CIF Calculation',
      'Customs Duty',
      'Purchase Tax Calculation',
      'Additional Expenses',
      'VAT Calculation',
      'Import Factors',
    ]);
    expect(screen.getByText('Forklift')).toBeInTheDocument();
    expect(screen.getAllByText('Import Factor').length).toBeGreaterThan(0);
  });

  it('charts the cost parts with the same figures as the totals', () => {
    renderResult(`?c=${linkFor(fixture('everything combined'))}`);
    const charts = within(
      screen.getByRole('region', { name: 'Visual summary' }),
    );
    expect(
      charts.getAllByRole('heading', { level: 3 }).map(h => h.textContent),
    ).toEqual(['What makes up the total', 'How the total builds up']);
    const buildUp = within(screen.getByTestId('build-up'));
    expect(buildUp.getByText('Landed Cost')).toBeInTheDocument();
    expect(buildUp.getByText('₪111,999.89')).toBeInTheDocument();
    expect(buildUp.getByText('₪132,159.87')).toBeInTheDocument();
    expect(screen.queryByTestId('weight-chart')).not.toBeInTheDocument();
  });

  it('charts which Air Shipment weight is billed', () => {
    renderResult(
      `?c=${linkFor(fixture('air: multi carton, volumetric wins'))}`,
    );
    const weight = within(screen.getByTestId('weight-chart'));
    const billed = weight.getByText('Billed').closest('li')!;
    expect(billed).toHaveTextContent('Volumetric Weight');
    expect(billed).toHaveTextContent('104.29 kg');
  });

  it('shows Air Shipment cards and per-Carton rows', () => {
    renderResult(
      `?c=${linkFor(fixture('air: multi carton, volumetric wins'))}`,
    );
    expect(screen.getAllByText('Chargeable Weight').length).toBeGreaterThan(0);
    expect(screen.getAllByText('104.29 kg').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$461.52').length).toBeGreaterThan(0);
    expect(screen.getByText('Carton 1')).toBeInTheDocument();
    expect(screen.getByText('Carton 2')).toBeInTheDocument();
    expect(
      screen.getByText('Chargeable Weight (Volumetric)'),
    ).toBeInTheDocument();
  });

  it('hides the factors when Cost is 0', () => {
    const input = fixture('usd cost, derived insurance');
    renderResult(
      `?c=${linkFor({ ...input, cif: { ...input.cif, cost: { amount: 0, currency: 'USD' } } })}`,
    );
    expect(screen.queryByText('Import Factor')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Shekel-per-Unit Factor'),
    ).not.toBeInTheDocument();
  });

  it.each([
    [
      { source: 'live', lastUpdate: '2026-10-13T12:20:03Z' },
      'Bank of Israel rate, Oct 13, 2026',
    ],
    [
      { source: 'cached', lastUpdate: '2026-10-13T12:20:03Z' },
      'Last known Bank of Israel rate from Oct 13, 2026',
    ],
    [{ source: 'manual' }, 'Rates entered manually'],
  ] as const)('describes %j rates', (rates, text) => {
    renderResult(
      `?c=${linkFor(fixture('usd cost, derived insurance'), rates)}`,
    );
    expect(screen.getByTestId('rates-note')).toHaveTextContent(text);
    expect(screen.getByTestId('rates-note')).toHaveTextContent(
      'USD 3.074 · EUR 3.4393',
    );
  });

  it.each([
    ['missing', ''],
    ['garbage', '?c=nonsense'],
    [
      'invalid input',
      `?c=${linkFor({ ...fixture('usd cost, derived insurance'), rates: { USD: 0, EUR: 0 } })}`,
    ],
  ])('shows an error for a %s link', async (_, search) => {
    const router = renderResult(search);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'This calculation link is invalid or incomplete.',
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('link', { name: 'Back to calculator' }));
    });
    expect(router.state.location.pathname).toBe('/calculator');
  });

  it('copies the link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    renderResult(`?c=${linkFor(fixture('usd cost, derived insurance'))}`);
    expect(
      screen.queryByRole('button', { name: 'Share' }),
    ).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    });
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(
      screen.getByRole('button', { name: 'Link copied' }),
    ).toBeInTheDocument();
  });

  it('opens the inputs in the calculator for editing', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({}, { status: 502 })),
    );
    const input = fixture('custom expenses');
    const router = renderResult(`?c=${linkFor(input, { source: 'manual' })}`);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    });
    expect(router.state.location.pathname).toBe('/calculator');
    expect(screen.getByLabelText('Cost')).toHaveValue('10000');
    expect(screen.getByLabelText('USD $')).toHaveValue('3.074');
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Entered manually'),
    );
    expect(screen.getByDisplayValue('Port storage')).toBeInTheDocument();
  });
});
