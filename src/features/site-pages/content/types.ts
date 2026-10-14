import type { Language } from '@/features/i18n';

export type LegalSection = { heading: string; body: string[] };

/** A legal page in every language; each language has the same sections. */
export type LegalDocument = {
  effectiveDate: string;
  sections: Record<Language, LegalSection[]>;
};

export const CONTACT_EMAIL = 'omrayed.27@gmail.com';
