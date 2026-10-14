import { afterEach, describe, expect, it, vi } from 'vitest';

import { detectLanguage } from './detect';

afterEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.restoreAllMocks();
});

describe('detectLanguage', () => {
  it.each([
    [['he-IL'], 'he'],
    [['iw'], 'he'],
    [['ar-EG', 'en'], 'ar'],
    [['fr-FR', 'de'], 'en'],
    [['fr-FR', 'he'], 'he'],
    [[], 'en'],
  ])('browser %j → %s', (languages, expected) => {
    expect(detectLanguage(languages)).toBe(expected);
  });

  it('prefers the saved choice over the browser language', () => {
    localStorage.setItem('language', 'ar');
    expect(detectLanguage(['he-IL'])).toBe('ar');
  });

  it('ignores an unsupported saved value', () => {
    localStorage.setItem('language', 'fr');
    expect(detectLanguage(['he-IL'])).toBe('he');
  });

  it('falls back to the browser when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(detectLanguage(['ar'])).toBe('ar');
  });

  it('takes ?lang= first, saves it and strips it from the URL', () => {
    localStorage.setItem('language', 'ar');
    window.history.replaceState(null, '', '/guides?tab=terms&lang=he');
    expect(detectLanguage(['en'])).toBe('he');
    expect(localStorage.getItem('language')).toBe('he');
    expect(window.location.pathname + window.location.search).toBe(
      '/guides?tab=terms',
    );
  });

  it('strips an unsupported ?lang= and falls back', () => {
    window.history.replaceState(null, '', '/?lang=fr');
    expect(detectLanguage(['he'])).toBe('he');
    expect(window.location.search).toBe('');
  });
});
