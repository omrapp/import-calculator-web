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
        <li key={term.id} className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary px-2 py-1 text-sm font-bold text-primary-foreground">
              <bdi>{term.term}</bdi>
            </span>
            <h2 className="font-semibold">{term.name[language]}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {term.description[language]}
          </p>
        </li>
      ))}
    </ul>
  );
}
