import { pdf } from '@react-pdf/renderer';

import { type FontSources, registerFonts } from './fonts';
import type { PdfModel } from './model';
import { ResultDocument } from './ResultDocument';

export async function renderPdf(
  model: PdfModel,
  fonts?: FontSources,
): Promise<Blob> {
  registerFonts(fonts);
  return pdf(<ResultDocument model={model} />).toBlob();
}
