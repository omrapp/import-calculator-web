import type { CalculationInput, Currency, ExpenseAmount, Money } from './types';

/** A Calculation's inputs plus where its exchange rates came from. */
export type CalculationLink = {
  v: 1;
  input: CalculationInput;
  rates: { source: 'live' | 'cached' | 'manual'; lastUpdate?: string };
};

export function encodeCalculation(link: CalculationLink): string {
  const bytes = new TextEncoder().encode(JSON.stringify(link));
  let binary = '';
  bytes.forEach(byte => (binary += String.fromCharCode(byte)));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** null when the string is not a valid v1 link. */
export function decodeCalculation(encoded: string): CalculationLink | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    const value: unknown = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    );
    return isCalculationLink(value) ? value : null;
  } catch {
    return null;
  }
}

// Structural checks only; value rules (positive rates etc.) stay in validate().

type Unknown = Record<string, unknown>;

const isObject = (v: unknown): v is Unknown =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);
const isCurrency = (v: unknown): v is Currency =>
  v === 'USD' || v === 'EUR' || v === 'ILS';
const isMoney = (v: unknown): v is Money =>
  isObject(v) && isNumber(v.amount) && isCurrency(v.currency);
const isExpenseAmount = (v: unknown): v is ExpenseAmount =>
  isMoney(v) || (isObject(v) && isNumber(v.percent));

function isCalculationInput(v: unknown): v is CalculationInput {
  if (!isObject(v) || (v.mode !== 'standard' && v.mode !== 'air-shipment')) {
    return false;
  }
  const { rates, cif, duty, expenses, airShipment } = v;
  if (!isObject(rates) || !isNumber(rates.USD) || !isNumber(rates.EUR)) {
    return false;
  }
  if (
    !isObject(cif) ||
    !isMoney(cif.cost) ||
    !isMoney(cif.freight) ||
    !(cif.insurance === null || isMoney(cif.insurance)) ||
    !isNumber(cif.premiumPercent)
  ) {
    return false;
  }
  if (
    !isObject(duty) ||
    !(
      (duty.kind === 'percent' && isNumber(duty.percent)) ||
      (duty.kind === 'compound' &&
        (duty.rule === 'higher' || duty.rule === 'lower') &&
        isNumber(duty.optionI) &&
        isNumber(duty.optionII))
    )
  ) {
    return false;
  }
  if (
    !isNumber(v.tamaPercent) ||
    !isNumber(v.purchaseTaxPercent) ||
    !(v.vatPercent === null || isNumber(v.vatPercent))
  ) {
    return false;
  }
  if (
    !isObject(expenses) ||
    !['localTransport', 'customsBroker', 'bank', 'other'].every(key =>
      isExpenseAmount(expenses[key]),
    ) ||
    !Array.isArray(expenses.custom) ||
    !expenses.custom.every(
      (item: unknown) =>
        isObject(item) &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        isExpenseAmount(item.amount),
    )
  ) {
    return false;
  }
  if (airShipment !== undefined) {
    if (
      !isObject(airShipment) ||
      !Array.isArray(airShipment.cartons) ||
      !airShipment.cartons.every(
        (c: unknown) =>
          isObject(c) &&
          ['length', 'width', 'height', 'weight', 'quantity'].every(key =>
            isNumber(c[key]),
          ),
      ) ||
      !['divisor', 'ratePerKg', 'fuelSurchargePerKg', 'handlingFee'].every(
        key => isNumber(airShipment[key]),
      )
    ) {
      return false;
    }
  }
  return true;
}

function isCalculationLink(v: unknown): v is CalculationLink {
  return (
    isObject(v) &&
    v.v === 1 &&
    isCalculationInput(v.input) &&
    isObject(v.rates) &&
    ['live', 'cached', 'manual'].includes(v.rates.source as string) &&
    (v.rates.lastUpdate === undefined || typeof v.rates.lastUpdate === 'string')
  );
}
