import type { Language } from '@/features/i18n';

export type LocalizedString = Record<Language, string>;

/** Base path of an image in /public/guides, without size or format suffix. */
export type ImagePath = string;
