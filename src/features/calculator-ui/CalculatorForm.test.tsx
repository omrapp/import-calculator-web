import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { decodeCalculation } from '@/features/calc-engine';

import { CalculatorForm } from './CalculatorForm';

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

function ResultProbe() {
  const location = useLocation();
  return <output data-testid="result-search">{location.search}</output>;
}

function renderForm(mode: 'standard' | 'air-shipment' = 'standard') {
  const router = createMemoryRouter(
    [
      { path: '/', element: <CalculatorForm mode={mode} title="Calc" /> },
      { path: '/result', element: <ResultProbe /> },
    ],
    { initialEntries: ['/'] },
  );
  return render(<RouterProvider router={router} />);
}

const type = (label: string | RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const submit = () =>
  act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
  });

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('CalculatorForm', () => {
  it('shows Freight in Standard mode and Cartons in Air Shipment mode', async () => {
    ratesApi(ratesPayload);
    const { unmount } = renderForm('standard');
    expect(screen.getByLabelText('Freight')).toBeInTheDocument();
    expect(screen.queryByText('Carton 1')).not.toBeInTheDocument();
    unmount();

    renderForm('air-shipment');
    expect(screen.queryByLabelText('Freight')).not.toBeInTheDocument();
    expect(screen.getByText('Carton 1')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove Carton 1' }),
    ).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Add carton' }));
    expect(screen.getByText('Carton 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Carton 2' }));
    expect(screen.queryByText('Carton 2')).not.toBeInTheDocument();
  });

  it('prefills live Bank of Israel rates', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
    expect(screen.getByLabelText('EUR €')).toHaveValue('3.4393');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Bank of Israel rate, Oct 13, 2026',
    );
  });

  it('falls back to the last known rate, then to manual entry', async () => {
    localStorage.setItem('fx-rates:last', JSON.stringify(ratesPayload));
    ratesApi({ error: 'unavailable' }, 502);
    const { unmount } = renderForm();
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Last known Bank of Israel rate from Oct 13, 2026',
      ),
    );
    unmount();

    localStorage.clear();
    renderForm();
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        "Couldn't reach Bank of Israel",
      ),
    );
    expect(screen.getByLabelText('USD $')).toHaveValue('');
  });

  it('marks edited rates as manual and can restore the bank rate', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );

    type('USD $', '3.2');
    expect(screen.getByRole('status')).toHaveTextContent('Entered manually');

    fireEvent.click(
      screen.getByRole('button', { name: 'Use Bank of Israel rate' }),
    );
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
  });

  it('shows translated errors and stays on the page when inputs are invalid', async () => {
    ratesApi({}, 502);
    renderForm();
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent("Couldn't reach"),
    );
    type('Cost', '1000');
    fireEvent.click(screen.getByRole('radio', { name: /Higher of two/ }));
    type('Duty Option I', '500');
    await submit();

    expect(screen.getByLabelText('USD $')).toHaveAccessibleDescription(
      'Required',
    );
    expect(screen.getByLabelText('Duty Option II')).toHaveAccessibleDescription(
      'Enter both Duty Options',
    );
    expect(screen.queryByTestId('result-search')).not.toBeInTheDocument();
    expect(screen.getByLabelText('USD $')).toHaveFocus();

    type('USD $', '3.5');
    expect(screen.getByLabelText('USD $')).not.toHaveAccessibleDescription(
      'Required',
    );
  });

  it('flags an invalid expression', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
    type('Cost', '12+');
    await submit();
    expect(screen.getByLabelText('Cost')).toHaveAccessibleDescription(
      'Not a valid number or expression',
    );
  });

  it('marks required fields with * and the rest as optional', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
    expect(screen.getByLabelText('USD $')).toHaveAttribute(
      'aria-required',
      'true',
    );
    expect(screen.getByLabelText('Cost')).not.toHaveAttribute('aria-required');
    expect(screen.getAllByText('(optional)').length).toBeGreaterThan(0);
    expect(
      screen.getByText('Fields marked * are required'),
    ).toBeInTheDocument();
  });

  it('explains Customs Duty in an info popup with an example', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'About Customs Duty Rate' }),
      );
    });
    const dialog = screen.getByRole('dialog', { name: 'Customs Duty rate' });
    expect(within(dialog).getByText('Example')).toBeInTheDocument();
    expect(within(dialog).getByText(/= ₪1,200/)).toBeInTheDocument();
  });

  it('drops letters and symbols typed into a number field', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
    type('Cost', '12abc$0*2');
    expect(screen.getByLabelText('Cost')).toHaveValue('120*2');
  });

  it('flags an invalid expression when the field loses focus', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
    type('Cost', '(12+');
    fireEvent.blur(screen.getByLabelText('Cost'));
    await waitFor(() =>
      expect(screen.getByLabelText('Cost')).toHaveAccessibleDescription(
        'Not a valid number or expression',
      ),
    );
  });

  it('navigates to the Result with the inputs encoded in the URL', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
    type('Cost', '1000*10');
    type('Freight', '1200');
    type('Customs Duty Rate', '12');
    await submit();

    const search = await screen.findByTestId('result-search');
    const link = decodeCalculation(
      new URLSearchParams(search.textContent ?? '').get('c') ?? '',
    );
    expect(link).toMatchObject({
      v: 1,
      rates: { source: 'live', lastUpdate: '2026-10-13T12:20:03Z' },
      input: {
        mode: 'standard',
        rates: { USD: 3.074, EUR: 3.4393 },
        cif: {
          cost: { amount: 10000, currency: 'USD' },
          freight: { amount: 1200, currency: 'USD' },
          insurance: null,
        },
        duty: { kind: 'percent', percent: 12 },
        vatPercent: null,
      },
    });
  });

  it('restores the draft after a remount, and Clear removes it', async () => {
    ratesApi(ratesPayload);
    const { unmount } = renderForm();
    type('Cost', '777');
    await waitFor(() =>
      expect(localStorage.getItem('draft:standard')).not.toBeNull(),
    );
    unmount();

    renderForm();
    expect(screen.getByLabelText('Cost')).toHaveValue('777');

    fireEvent.click(screen.getByRole('button', { name: 'Clear form' }));
    const dialog = await screen.findByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Clear' }));
    await waitFor(() => expect(screen.getByLabelText('Cost')).toHaveValue(''));
    await waitFor(() =>
      expect(localStorage.getItem('draft:standard')).toBeNull(),
    );
  });

  it('updates the live CIF preview as Cost changes', async () => {
    ratesApi(ratesPayload);
    renderForm();
    await waitFor(() =>
      expect(screen.getByLabelText('USD $')).toHaveValue('3.074'),
    );
    type('Cost', '100');
    // 100 × 3.074 = 307.40
    expect(screen.getByTestId('cif-preview')).toHaveTextContent('₪307.40');
    type('Cost', '200');
    expect(screen.getByTestId('cif-preview')).toHaveTextContent('₪614.80');
  });
});
