import { Check, Minus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Cell = 'yes' | 'no' | 'maybe';

// Mirrors module 1's text: what each value band of a personal import pays.
const ROWS: { band: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { band: 'up_to_75', cells: ['no', 'no', 'no', 'no'] },
  { band: '75_500', cells: ['no', 'yes', 'maybe', 'no'] },
  { band: '500_1000', cells: ['yes', 'yes', 'maybe', 'no'] },
  { band: 'over_1000', cells: ['yes', 'yes', 'maybe', 'yes'] },
];

const COLUMNS = ['duty', 'vat', 'purchase_tax', 'broker'] as const;

function Mark({ cell }: { cell: Cell }) {
  const { t } = useTranslation();
  const Icon = cell === 'yes' ? Check : cell === 'no' ? X : Minus;
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon
        aria-hidden
        className={
          cell === 'yes'
            ? 'size-4 text-amber-700 dark:text-amber-300'
            : cell === 'no'
              ? 'size-4 text-emerald-700 dark:text-emerald-300'
              : 'size-4 text-muted-foreground'
        }
      />
      {t(`guides.docs.personal.${cell}`)}
    </span>
  );
}

/** Personal import value bands vs. the taxes they pay. */
export function PersonalImportTable() {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card shadow-xs">
      <table className="w-full min-w-xl text-sm">
        <caption className="px-4 pt-3 text-start text-xs text-muted-foreground caption-bottom pb-3">
          {t('guides.docs.personal.caption')}
        </caption>
        <thead className="bg-muted/50 text-start">
          <tr>
            <th scope="col" className="px-4 py-2.5 text-start font-semibold">
              {t('guides.docs.personal.value')}
            </th>
            {COLUMNS.map(column => (
              <th
                key={column}
                scope="col"
                className="px-4 py-2.5 text-start font-semibold"
              >
                {t(`guides.docs.personal.${column}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(({ band, cells }) => (
            <tr key={band} className="border-t">
              <th scope="row" className="px-4 py-2.5 text-start font-medium">
                <bdi dir="ltr">{t(`guides.docs.personal.${band}`)}</bdi>
              </th>
              {cells.map((cell, i) => (
                <td key={COLUMNS[i]} className="px-4 py-2.5">
                  <Mark cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
