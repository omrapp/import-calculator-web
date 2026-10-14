import { afterEach, describe, expect, it, vi } from 'vitest';

import { detectLanguage } from './detect';

afterEach(() => {
  localStorage.clear();
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
});
