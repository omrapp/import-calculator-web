import { Font } from '@react-pdf/renderer';

import arabic400 from '@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff?url';
import arabic700 from '@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff?url';
import hebrew400 from '@fontsource/noto-sans-hebrew/files/noto-sans-hebrew-hebrew-400-normal.woff?url';
import hebrew700 from '@fontsource/noto-sans-hebrew/files/noto-sans-hebrew-hebrew-700-normal.woff?url';
import latin400 from '@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff?url';
import latin700 from '@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff?url';

export type FontSources = Record<
  'latin' | 'hebrew' | 'arabic',
  { regular: string; bold: string }
>;

/** Bundled, self-hosted font files; fetched only when a PDF is made. */
export const bundledFonts: FontSources = {
  latin: { regular: latin400, bold: latin700 },
  hebrew: { regular: hebrew400, bold: hebrew700 },
  arabic: { regular: arabic400, bold: arabic700 },
};

const families = {
  latin: 'NotoSans',
  hebrew: 'NotoSansHebrew',
  arabic: 'IBMPlexSansArabic',
} as const;

/** Latin first; Hebrew and Arabic letters fall back to their own fonts. */
export const FONT_STACK = [families.latin, families.hebrew, families.arabic];

let registered = false;

export function registerFonts(sources: FontSources = bundledFonts): void {
  if (registered) return;
  for (const script of Object.keys(families) as (keyof typeof families)[]) {
    Font.register({
      family: families[script],
      fonts: [
        { src: sources[script].regular, fontWeight: 400 },
        { src: sources[script].bold, fontWeight: 700 },
      ],
    });
  }
  // Words are never hyphenated; Hebrew and Arabic have no hyphenation rules here.
  Font.registerHyphenationCallback(word => [word]);
  registered = true;
}
