import { LegalView, privacyPolicy } from '@/features/site-pages';

export function PrivacyPage() {
  return <LegalView titleKey="nav.privacy" document={privacyPolicy} />;
}
