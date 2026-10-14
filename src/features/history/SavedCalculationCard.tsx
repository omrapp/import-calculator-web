import { ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { formatDate, formatMoney, useLanguage } from '@/features/i18n';

import { resultPath } from './resultPath';
import type { SavedCalculation } from './storage';

export function SavedCalculationCard({
  item,
  onRecalculate,
  onDelete,
}: {
  item: SavedCalculation;
  /** Absent while today's rates are loading or unavailable. */
  onRecalculate?: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { input } = item.link;
  const money = (amount: number) => formatMoney(amount, 'ILS', language);

  return (
    <li className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">
          {t(input.mode === 'standard' ? 'nav.standard' : 'nav.air_shipment')}
        </h2>
        <span className="text-sm text-muted-foreground">
          {formatDate(item.savedAt, language)}
        </span>
      </div>
      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">{t('home.labels.cost')}</dt>
          <dd className="tabular-nums">
            <bdi dir="ltr">
              {formatMoney(
                input.cif.cost.amount,
                input.cif.cost.currency,
                language,
              )}
            </bdi>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('result.landed_cost')}</dt>
          <dd className="tabular-nums">
            <bdi dir="ltr">{money(item.totals.landedCost)}</bdi>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">
            {t('result.total_including_vat')}
          </dt>
          <dd className="font-semibold tabular-nums">
            <bdi dir="ltr">{money(item.totals.totalIncludingVat)}</bdi>
          </dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2">
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
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onDelete}
          aria-label={t('history.delete_item')}
        >
          <Trash2 />
          {t('common.delete')}
        </Button>
      </div>
    </li>
  );
}
