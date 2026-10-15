import { FileDown, ImageDown, Loader2, Printer } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import type {
  CalculationLink,
  CalculationResult,
  Currency,
} from '@/features/calc-engine';
import { useLanguage } from '@/features/i18n';

import { datedFilename, downloadBlob, downloadUrl } from './download';
import { buildPdfModel } from './pdf/model';
import { nodeToPng } from './png';

type Job = 'png' | 'pdf';

export function ExportMenu({
  link,
  result,
  content,
  currency = 'ILS',
}: {
  link: CalculationLink;
  result: CalculationResult;
  content: HTMLElement | null;
  /** Amounts in the PDF follow the currency shown on the Result. */
  currency?: Currency;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [busy, setBusy] = useState<Job | null>(null);
  const [failed, setFailed] = useState(false);

  const run = async (job: Job, work: () => Promise<void>) => {
    setBusy(job);
    setFailed(false);
    try {
      await work();
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  };

  const exportPng = () =>
    run('png', async () => {
      if (!content) throw new Error('Result not rendered');
      downloadUrl(await nodeToPng(content), datedFilename('png'));
    });

  const exportPdf = () =>
    run('pdf', async () => {
      const { renderPdf } = await import('./pdf/renderPdf');
      const model = buildPdfModel(link, result, language, t, currency);
      downloadBlob(await renderPdf(model), datedFilename('pdf'));
    });

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={busy !== null}
        onClick={() => void exportPng()}
      >
        {busy === 'png' ? <Loader2 className="animate-spin" /> : <ImageDown />}
        {t('export.png')}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={busy !== null}
        onClick={() => void exportPdf()}
      >
        {busy === 'pdf' ? <Loader2 className="animate-spin" /> : <FileDown />}
        {t('export.pdf')}
      </Button>
      <Button type="button" variant="outline" onClick={() => window.print()}>
        <Printer />
        {t('export.print')}
      </Button>
      {failed && (
        <p
          role="alert"
          className="col-span-full basis-full text-sm text-destructive"
        >
          {t('export.failed')}
        </p>
      )}
    </>
  );
}
