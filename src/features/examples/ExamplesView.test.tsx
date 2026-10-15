import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { decodeCalculation } from '@/features/calc-engine';
import { CalculatorForm } from '@/features/calculator-ui';
import { formatMoney } from '@/features/i18n';

import { EXAMPLES } from './data';
import { ExamplesView } from './ExamplesView';

function renderExamples() {
  const router = createMemoryRouter(
    [
      { path: '/examples', element: <ExamplesView /> },
      { path: '/result', element: <p>result page</p> },
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
      { path: '/calculator', element: <p>calculator</p> },
    ],
    { initialEntries: ['/examples'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

const example = (title: string) => screen.getByRole('article', { name: title });

afterEach(() => localStorage.clear());

describe('ExamplesView', () => {
  it('shows every example with its steps', () => {
    renderExamples();
    expect(screen.getAllByRole('article')).toHaveLength(EXAMPLES.length);
    const base = example('Electronics by sea: the base case');
    expect(within(base).getByText('CIF Total')).toBeInTheDocument();
    expect(
      within(base).getAllByText(formatMoney(58_088.1, 'ILS', 'en')).length,
    ).toBeGreaterThan(0);
  });

  it('compares a variant with its base example', () => {
    renderExamples();
    const note = within(example('Same goods, no customs duty')).getByTestId(
      'compare-note',
    );
    expect(note).toHaveTextContent(
      'What changes from Example 1 (Electronics by sea: the base case)',
    );
    expect(note).toHaveTextContent(formatMoney(5_920.3, 'ILS', 'en'));
  });

  it('fills the compound duty numbers into the story', () => {
    renderExamples();
    expect(
      within(example('Shoes with a compound duty')).getByText(
        /Option I is 12% × ₪41,810\.00 = ₪5,017\.20/,
      ),
    ).toBeInTheDocument();
  });

  it('draws each air carton with its volumetric weight', () => {
    renderExamples();
    const air = example('Air freight billed by volume');
    expect(within(air).getAllByRole('img', { name: /^Carton / })).toHaveLength(
      2,
    );
    expect(air).toHaveTextContent('(60 × 40 × 40) ÷ 6,000 × 10 = 160 kg');
  });

  it('links each example to a full Result', () => {
    renderExamples();
    const href = within(example('Expenses as a percentage'))
      .getByRole('link', { name: 'Open as a full Result' })
      .getAttribute('href')!;
    const link = decodeCalculation(
      new URL(href, 'http://x').searchParams.get('c')!,
    );
    expect(link?.meta?.title).toBe('Expenses as a percentage');
    expect(link?.input.expenses.custom[0].name).toBe('Port storage');
  });

  it('opens an example in the calculator with its rates', async () => {
    const router = renderExamples();
    await act(async () => {
      fireEvent.click(
        within(example('Air freight billed by volume')).getByRole('button', {
          name: 'Try it in the calculator',
        }),
      );
    });
    expect(router.state.location.pathname).toBe('/air-shipment');
    expect(await screen.findByLabelText('Cost')).toHaveValue('6000');
    expect(screen.getByLabelText('USD $')).toHaveValue('3.7');
  });
});
