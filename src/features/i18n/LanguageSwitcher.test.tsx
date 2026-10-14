import { act, fireEvent, render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { afterEach, describe, expect, it } from 'vitest';

import { changeLanguage } from './i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

function Title() {
  const { t } = useTranslation();
  return <h1>{t('nav.history')}</h1>;
}

afterEach(async () => {
  await act(() => changeLanguage('en'));
  localStorage.clear();
});

describe('LanguageSwitcher', () => {
  it('switches text and direction instantly and remembers the choice', async () => {
    render(
      <>
        <LanguageSwitcher />
        <Title />
      </>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('History');

    await act(async () => {
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'he' },
      });
    });

    expect(screen.getByRole('heading')).toHaveTextContent('היסטוריה');
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).toHaveAttribute('lang', 'he');
    expect(localStorage.getItem('language')).toBe('he');
  });

  it('lists languages by their native names', () => {
    render(<LanguageSwitcher />);
    expect(
      screen.getAllByRole('option').map(option => option.textContent),
    ).toEqual(['English', 'עברית', 'العربية']);
  });
});
