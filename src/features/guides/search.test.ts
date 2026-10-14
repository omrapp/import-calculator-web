import { describe, expect, it } from 'vitest';

import { galleryItems } from './data/gallery';
import { learningModules } from './data/learning-modules';
import { presentationSlides } from './data/presentation';
import { tradeTerms } from './data/terms';
import { tradingWebsites } from './data/websites';
import {
  searchGallery,
  searchModules,
  searchSlides,
  searchTerms,
  searchWebsites,
} from './search';

describe('guides search', () => {
  it('returns everything for an empty or blank query', () => {
    expect(searchModules(learningModules, '', 'en')).toHaveLength(
      learningModules.length,
    );
    expect(searchSlides(presentationSlides, '  ', 'he')).toHaveLength(22);
    expect(searchTerms(tradeTerms, '', 'ar')).toHaveLength(tradeTerms.length);
    expect(searchGallery(galleryItems, '', 'en')).toHaveLength(6);
    expect(searchWebsites(tradingWebsites, '', 'en')).toHaveLength(
      tradingWebsites.length,
    );
  });

  it('matches terms by code, name and description, case-insensitively', () => {
    expect(searchTerms(tradeTerms, 'fob', 'en').map(t => t.term)).toContain(
      'FOB',
    );
    expect(
      searchTerms(tradeTerms, 'משלוח על הספינה', 'he').map(t => t.term),
    ).toEqual(['FOB']);
    expect(
      searchTerms(tradeTerms, 'التسليم على ظهر السفينة', 'ar').map(t => t.term),
    ).toEqual(['FOB']);
  });

  it('matches modules by content, slides by title only', () => {
    expect(
      searchModules(learningModules, 'up to $150', 'en').map(m => m.id),
    ).toContain('1');
    expect(searchSlides(presentationSlides, 'incoterms', 'en')).toHaveLength(4);
    expect(searchSlides(presentationSlides, 'zzz', 'en')).toEqual([]);
  });

  it('matches gallery and websites by title and description', () => {
    expect(
      searchGallery(galleryItems, 'certificate of origin', 'en').map(g => g.id),
    ).toContain('COO');
    expect(
      searchWebsites(tradingWebsites, 'china', 'en').map(w => w.url),
    ).toContain('https://www.wechat.com/');
  });
});
