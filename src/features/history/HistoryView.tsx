import { Download, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useExchangeRates } from '@/features/fx-rates';

import { resultPath } from './resultPath';
import { SavedCalculationCard } from './SavedCalculationCard';
import {
  clearHistory,
  deleteSaved,
  exportHistory,
  importHistory,
  type SavedCalculation,
} from './storage';
import { useHistory } from './useHistory';

function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'application/json' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

type ImportMessage = { ok: boolean; text: string } | null;

export function HistoryView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const history = useHistory();
  const rates = useExchangeRates();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<ImportMessage>(null);

  useEffect(() => {
    document.title = t('history.page_title');
  }, [t]);

  const recalculate =
    rates.status === 'live' || rates.status === 'cached'
      ? (item: SavedCalculation) =>
          void navigate(
            resultPath({
              ...item.link,
              input: { ...item.link.input, rates: rates.rates },
              rates: { source: rates.status, lastUpdate: rates.lastUpdate },
            }),
          )
      : undefined;

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const { added, skipped } = importHistory(await file.text());
      setMessage({ ok: true, text: t('history.imported', { added, skipped }) });
    } catch {
      setMessage({ ok: false, text: t('history.import_failed') });
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{t('history.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={history.length === 0}
            onClick={() =>
              downloadText(
                exportHistory(),
                `import-calculator-history-${today}.json`,
              )
            }
          >
            <Download />
            {t('history.export')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInput.current?.click()}
          >
            <Upload />
            {t('history.import')}
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            className="hidden"
            data-testid="history-import"
            onChange={event => {
              void onImport(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={history.length === 0}
              >
                <Trash2 />
                {t('history.clear_history')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('history.clear_history')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('history.clear_confirmation')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>
                  {t('common.clear')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {message && (
        <p
          role={message.ok ? 'status' : 'alert'}
          className={message.ok ? 'text-sm' : 'text-sm text-destructive'}
        >
          {message.text}
        </p>
      )}

      {history.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-6">
          <p>{t('history.no_history')}</p>
          <Button asChild>
            <Link to="/">{t('pages.back_to_calculator')}</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {t('history.backup_hint')}
          </p>
          {rates.status === 'unavailable' && (
            <p className="text-sm text-muted-foreground">
              {t('history.rates_unavailable')}
            </p>
          )}
          <ul className="flex flex-col gap-3">
            {history.map(item => (
              <SavedCalculationCard
                key={item.id}
                item={item}
                onRecalculate={recalculate && (() => recalculate(item))}
                onDelete={() => deleteSaved(item.id)}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
