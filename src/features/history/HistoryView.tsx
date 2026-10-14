import {
  CircleAlert,
  CircleCheck,
  Download,
  History,
  Info,
  Trash2,
  Upload,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import { EmptyState, PageHeader } from '@/components/page';
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
import { formatNumber, useLanguage } from '@/features/i18n';
import { fadeUp } from '@/lib/motion';

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
  const { language } = useLanguage();
  const navigate = useNavigate();
  const history = useHistory();
  const rates = useExchangeRates();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<ImportMessage>(null);

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

  const toolbar = (
    <>
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
            className="text-muted-foreground hover:text-destructive"
            disabled={history.length === 0}
          >
            <Trash2 />
            {t('history.clear_history')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('history.clear_history')}</AlertDialogTitle>
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
    </>
  );

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeader
        icon={<History />}
        title={t('history.title')}
        description={history.length > 0 && t('history.backup_hint')}
        meta={
          history.length > 0 && (
            <span data-testid="history-count">
              {t('history.count', {
                n: formatNumber(history.length, language, 0),
              })}
            </span>
          )
        }
        actions={toolbar}
      />

      <AnimatePresence initial={false}>
        {message && (
          <m.p
            key={message.text}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            role={message.ok ? 'status' : 'alert'}
            className={
              message.ok
                ? 'flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-success'
                : 'flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive'
            }
          >
            {message.ok ? (
              <CircleCheck className="size-4 shrink-0" aria-hidden />
            ) : (
              <CircleAlert className="size-4 shrink-0" aria-hidden />
            )}
            {message.text}
          </m.p>
        )}
      </AnimatePresence>

      {history.length > 0 && rates.status === 'unavailable' && (
        <p className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          <Info className="size-4 shrink-0" aria-hidden />
          {t('history.rates_unavailable')}
        </p>
      )}

      {history.length === 0 ? (
        <EmptyState
          icon={<History />}
          title={t('history.no_history')}
          action={
            <Button asChild>
              <Link to="/">{t('pages.back_to_calculator')}</Link>
            </Button>
          }
        >
          {t('history.empty_hint')}
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {history.map((item, index) => (
              <SavedCalculationCard
                key={item.id}
                item={item}
                index={index}
                onRecalculate={recalculate && (() => recalculate(item))}
                onDelete={() => deleteSaved(item.id)}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
