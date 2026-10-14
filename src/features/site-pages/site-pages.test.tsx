import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { changeLanguage, SUPPORTED_LANGUAGES } from '@/features/i18n';
import { initTheme } from '@/features/theme';

import { privacyPolicy } from './content/privacy';
import { termsOfUse } from './content/terms';
import { ContactView } from './ContactView';
import { LegalView } from './LegalView';
import { SettingsView } from './SettingsView';

afterEach(async () => {
  vi.unstubAllGlobals();
  await changeLanguage('en');
});

describe('Settings', () => {
  it('switches the language and direction', async () => {
    render(<SettingsView />);
    await act(async () => {
      fireEvent.click(screen.getByRole('radio', { name: 'עברית' }));
    });
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).toHaveAttribute('lang', 'he');
    expect(screen.getByRole('radio', { name: 'עברית' })).toBeChecked();
  });

  it('switches the theme', () => {
    initTheme('system');
    render(<SettingsView />);
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
    expect(document.documentElement).toHaveClass('dark');
    fireEvent.click(screen.getByRole('radio', { name: 'Light' }));
    expect(document.documentElement).not.toHaveClass('dark');
    initTheme('system');
  });

  it('shares the site with the Web Share API when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, share });
    render(<SettingsView />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Share this site' }));
    });
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ url: window.location.origin }),
    );
  });

  it('copies the site URL otherwise', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      ...navigator,
      share: undefined,
      clipboard: { writeText },
    });
    render(<SettingsView />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Share this site' }));
    });
    expect(writeText).toHaveBeenCalledWith(window.location.origin);
    expect(screen.getByRole('button', { name: 'Link copied' })).toBeVisible();
  });
});

describe('Contact', () => {
  it('shows the email and a mailto link', () => {
    render(<ContactView />);
    expect(screen.getByText('omrayed.27@gmail.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Send email' })).toHaveAttribute(
      'href',
      'mailto:omrayed.27@gmail.com?subject=Import%20Calculator',
    );
  });
});

describe('Privacy and Terms', () => {
  it.each([
    ['privacy', privacyPolicy],
    ['terms', termsOfUse],
  ])('%s has the same sections in every language', (_, legal) => {
    const counts = SUPPORTED_LANGUAGES.map(lang => legal.sections[lang].length);
    expect(new Set(counts).size).toBe(1);
    for (const lang of SUPPORTED_LANGUAGES) {
      for (const section of legal.sections[lang]) {
        expect(section.heading).not.toBe('');
        expect(section.body.length).toBeGreaterThan(0);
      }
    }
  });

  it.each(SUPPORTED_LANGUAGES)('renders every section in %s', async lang => {
    await changeLanguage(lang);
    render(
      <MemoryRouter>
        <LegalView titleKey="nav.privacy" document={privacyPolicy} />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(
      privacyPolicy.sections[lang].length,
    );
  });
});
