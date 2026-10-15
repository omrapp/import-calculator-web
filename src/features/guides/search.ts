import type { Language } from '@/features/i18n';

import type { LearningModule } from './data/learning-modules';
import type { PresentationSlide } from './data/presentation';
import type { TradeTerm } from './data/terms';
import type { TradingWebsite, WebsiteTag } from './data/websites';

// Same matching as the app: case-insensitive substring per tab's fields.
const matcher = (query: string) => {
  const q = query.trim().toLowerCase();
  return (...fields: string[]) =>
    q === '' || fields.some(field => field.toLowerCase().includes(q));
};

export const searchModules = (
  items: LearningModule[],
  query: string,
  lang: Language,
) => items.filter(m => matcher(query)(m.title[lang], m.content[lang]));

export const searchSlides = (
  items: PresentationSlide[],
  query: string,
  lang: Language,
) => items.filter(s => matcher(query)(s.title[lang]));

export const searchTerms = (
  items: TradeTerm[],
  query: string,
  lang: Language,
) =>
  items.filter(t => matcher(query)(t.term, t.name[lang], t.description[lang]));

/** Also matches tags, by their label in the current language. */
export const searchWebsites = (
  items: TradingWebsite[],
  query: string,
  lang: Language,
  tagLabel: (tag: WebsiteTag) => string = tag => tag,
) =>
  items.filter(w =>
    matcher(query)(w.title[lang], w.description[lang], ...w.tags.map(tagLabel)),
  );
