import { describe, expect, it } from 'vitest';

import { formatCompactMoney, formatMoney, formatNumber } from './format';
import { SUPPORTED_LANGUAGES } from './languages';

describe('format', () => {
  it.each(SUPPORTED_LANGUAGES)('uses Latin digits in %s', language => {
    expect(formatMoney(1234.5, 'ILS', language)).toMatch(/1,234\.50/);
    expect(formatNumber(1.23456, language, 4)).toMatch(/1\.2346/);
  });

  it('shows the currency symbol', () => {
    expect(formatMoney(10, 'ILS', 'en')).toContain('₪');
    expect(formatMoney(10, 'USD', 'en')).toContain('$');
    expect(formatMoney(10, 'EUR', 'en')).toContain('€');
  });

  it.each(SUPPORTED_LANGUAGES)('shortens chart labels in %s', language => {
    const compact = formatCompactMoney(132159.87, 'ILS', language);
    expect(compact).toContain('₪');
    expect(compact).toMatch(/132/);
    expect(compact.length).toBeLessThan(
      formatMoney(132159.87, 'ILS', language).length,
    );
  });
});
