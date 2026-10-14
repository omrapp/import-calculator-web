import { LegalView, termsOfUse } from '@/features/site-pages';

export function TermsPage() {
  return <LegalView titleKey="nav.terms" document={termsOfUse} />;
}
