import { useLanguage } from '@/features/i18n';

import { tradeTerms } from '../data/terms';
import { searchTerms } from '../search';
import { EmptyState } from './EmptyState';

export function TermsTab({ query }: { query: string }) {
  const { language } = useLanguage();
  const terms = searchTerms(tradeTerms, query, language);
  if (terms.length === 0) return <EmptyState />;

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {terms.map(term => (
        <li
          key={term.id}
          className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-9 min-w-12 place-items-center rounded-lg bg-brand px-2 text-sm font-bold tracking-wide text-brand-foreground">
              <bdi>{term.term}</bdi>
            </span>
            <h2 className="leading-tight font-semibold">
              {term.name[language]}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {term.description[language]}
          </p>
        </li>
      ))}
    </ul>
  );
}
