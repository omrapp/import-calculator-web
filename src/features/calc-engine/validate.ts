import type {
  CalculationInput,
  Currency,
  ExpenseAmount,
  ValidationError,
} from './types';

export function validate(input: CalculationInput): ValidationError[] {
  const errors: ValidationError[] = [];

  const nonNegative = (field: string, value: number) => {
    if (!Number.isFinite(value)) errors.push({ field, code: 'required' });
    else if (value < 0) errors.push({ field, code: 'non-negative' });
  };
  const positive = (field: string, value: number) => {
    if (!Number.isFinite(value)) errors.push({ field, code: 'required' });
    else if (value <= 0) errors.push({ field, code: 'positive' });
  };
  const expense = (field: string, amount: ExpenseAmount) => {
    if ('percent' in amount) nonNegative(`${field}.percent`, amount.percent);
    else nonNegative(`${field}.amount`, amount.amount);
  };

  const { cif, duty, expenses } = input;
  const isAir = input.mode === 'air-shipment';

  nonNegative('cif.cost.amount', cif.cost.amount);
  if (!isAir) nonNegative('cif.freight.amount', cif.freight.amount);
  if (cif.insurance) nonNegative('cif.insurance.amount', cif.insurance.amount);
  nonNegative('cif.premiumPercent', cif.premiumPercent);

  if (isAir) {
    const air = input.airShipment;
    if (!air || air.cartons.length === 0) {
      errors.push({ field: 'airShipment.cartons', code: 'required' });
    } else {
      air.cartons.forEach((carton, i) => {
        const field = `airShipment.cartons.${i}`;
        nonNegative(`${field}.length`, carton.length);
        nonNegative(`${field}.width`, carton.width);
        nonNegative(`${field}.height`, carton.height);
        nonNegative(`${field}.weight`, carton.weight);
        positive(`${field}.quantity`, carton.quantity);
      });
      positive('airShipment.divisor', air.divisor);
      nonNegative('airShipment.ratePerKg', air.ratePerKg);
      nonNegative('airShipment.fuelSurchargePerKg', air.fuelSurchargePerKg);
      nonNegative('airShipment.handlingFee', air.handlingFee);
    }
  }

  if (duty.kind === 'percent') {
    nonNegative('duty.percent', duty.percent);
  } else {
    if (!(duty.optionI > 0)) {
      errors.push({ field: 'duty.optionI', code: 'duty-options-required' });
    }
    if (!(duty.optionII > 0)) {
      errors.push({ field: 'duty.optionII', code: 'duty-options-required' });
    }
  }

  nonNegative('tamaPercent', input.tamaPercent);
  nonNegative('purchaseTaxPercent', input.purchaseTaxPercent);
  if (input.vatPercent !== null) nonNegative('vatPercent', input.vatPercent);

  expense('expenses.localTransport', expenses.localTransport);
  expense('expenses.customsBroker', expenses.customsBroker);
  expense('expenses.bank', expenses.bank);
  expense('expenses.other', expenses.other);
  expenses.custom.forEach((item, i) =>
    expense(`expenses.custom.${i}.amount`, item.amount),
  );

  for (const currency of usedForeignCurrencies(input)) {
    positive(`rates.${currency}`, input.rates[currency]);
  }

  return errors;
}

/** Foreign currencies the Calculation converts, so only those rates are required. */
function usedForeignCurrencies(
  input: CalculationInput,
): Exclude<Currency, 'ILS'>[] {
  const { cif, expenses } = input;
  const amounts: ExpenseAmount[] = [
    cif.cost,
    ...(input.mode === 'air-shipment'
      ? [{ amount: 0, currency: 'USD' as const }]
      : [cif.freight]),
    ...(cif.insurance ? [cif.insurance] : []),
    expenses.localTransport,
    expenses.customsBroker,
    expenses.bank,
    expenses.other,
    ...expenses.custom.map(item => item.amount),
  ];
  const used = new Set<Exclude<Currency, 'ILS'>>();
  for (const amount of amounts) {
    if ('currency' in amount && amount.currency !== 'ILS') {
      used.add(amount.currency);
    }
  }
  return [...used].sort();
}
