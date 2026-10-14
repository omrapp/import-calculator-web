import { ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { ModeBadge } from '@/components/page';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney, useLanguage } from '@/features/i18n';
import { duration, ease, spring, staggerFor } from '@/lib/motion';

import { resultPath } from './resultPath';
import type { SavedCalculation } from './storage';

export function SavedCalculationCard({
  item,
  index,
  onRecalculate,
  onDelete,
}: {
  item: SavedCalculation;
  /** Position in the list, for the entrance stagger. */
  index: number;
  /** Absent while today's rates are loading or unavailable. */
  onRecalculate?: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { input } = item.link;
  const money = (amount: number) => formatMoney(amount, 'ILS', language);

  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: duration.normal,
          ease: ease.outQuart,
          delay: staggerFor(index),
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.98,
        transition: { duration: duration.fast, ease: ease.inQuart },
      }}
      transition={{ layout: spring.layout }}
      className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-xs transition-shadow duration-150 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2>
            <ModeBadge mode={input.mode} />
          </h2>
          <time
            dateTime={item.savedAt}
            className="text-sm text-muted-foreground"
          >
            {formatDate(item.savedAt, language)}
          </time>
        </div>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="-me-2 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          aria-label={t('history.delete_item')}
          title={t('history.delete_item')}
        >
          <Trash2 />
        </Button>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="col-span-2 flex flex-col gap-0.5 sm:col-span-1">
          <dt className="text-sm text-muted-foreground">
            {t('result.total_including_vat')}
          </dt>
          <dd className="text-2xl font-bold tracking-tight tabular-nums">
            <bdi dir="ltr">{money(item.totals.totalIncludingVat)}</bdi>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-sm text-muted-foreground">
            {t('home.labels.cost')}
          </dt>
          <dd className="font-medium tabular-nums">
            <bdi dir="ltr">
              {formatMoney(
                input.cif.cost.amount,
                input.cif.cost.currency,
                language,
              )}
            </bdi>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-sm text-muted-foreground">
            {t('result.landed_cost')}
          </dt>
          <dd className="font-medium tabular-nums">
            <bdi dir="ltr">{money(item.totals.landedCost)}</bdi>
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button asChild size="sm">
          <Link to={resultPath(item.link)}>
            <ExternalLink />
            {t('history.open')}
          </Link>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!onRecalculate}
          onClick={onRecalculate}
        >
          <RefreshCw />
          {t('history.recalculate')}
        </Button>
      </div>
    </m.li>
  );
}
