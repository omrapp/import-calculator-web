import {
  ArrowDown,
  ArrowRight,
  Banknote,
  FileCheck2,
  Handshake,
  type LucideIcon,
  PackageCheck,
  Search,
  Ship,
} from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

/** Bordered figure with a caption, shared by every diagram. */
export function Figure({
  caption,
  children,
  className,
}: {
  caption: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        'flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-xs sm:p-5',
        className,
      )}
    >
      {children}
      <figcaption className="text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

const FLOW: { key: string; icon: LucideIcon }[] = [
  { key: 'research', icon: Search },
  { key: 'order', icon: Handshake },
  { key: 'ship', icon: Ship },
  { key: 'clear', icon: FileCheck2 },
  { key: 'pay', icon: Banknote },
  { key: 'receive', icon: PackageCheck },
];

/** The import journey, step by step. Wraps on small screens, arrows follow reading direction. */
export function ImportFlowDiagram() {
  const { t } = useTranslation();
  return (
    <Figure caption={t('guides.docs.flow.caption')}>
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-[repeat(3,1fr_auto)] lg:grid-cols-[repeat(6,1fr_auto)]">
        {FLOW.map(({ key, icon: Icon }, i) => (
          <Fragment key={key}>
            <li className="flex items-start gap-3 rounded-xl border bg-background p-3 sm:flex-col sm:items-center sm:text-center">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1.5 font-semibold sm:justify-center">
                  <Icon aria-hidden className="size-4 text-highlight" />
                  {t(`guides.docs.flow.${key}`)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(`guides.docs.flow.${key}_desc`)}
                </span>
              </div>
            </li>
            {i < FLOW.length - 1 && (
              <li
                aria-hidden
                className={cn(
                  'grid place-items-center text-muted-foreground',
                  // Row ends (after step 3 on sm) don't need a sideways arrow.
                  i === 2 && 'sm:max-lg:hidden',
                )}
              >
                <ArrowDown className="size-4 sm:hidden" />
                <ArrowRight className="hidden size-4 sm:block rtl:-scale-x-100" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </Figure>
  );
}

/** Actual vs volumetric weight, the larger is charged. Drawn in SVG. */
export function ChargeableWeightDiagram() {
  const { t } = useTranslation();
  return (
    <Figure caption={t('guides.docs.weight.caption')}>
      <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr]">
        <svg
          viewBox="0 0 200 150"
          className="mx-auto w-48 text-foreground"
          role="img"
          aria-label={t('guides.docs.weight.box_label')}
        >
          {/* Isometric carton */}
          <polygon
            points="40,50 120,50 160,20 80,20"
            className="fill-amber-500/30 stroke-current"
            strokeWidth="1.5"
          />
          <polygon
            points="40,50 120,50 120,130 40,130"
            className="fill-amber-500/20 stroke-current"
            strokeWidth="1.5"
          />
          <polygon
            points="120,50 160,20 160,100 120,130"
            className="fill-amber-500/35 stroke-current"
            strokeWidth="1.5"
          />
          <g className="fill-muted-foreground text-[10px]" fontFamily="inherit">
            <text x="80" y="144" textAnchor="middle">
              L
            </text>
            <text x="148" y="122">
              W
            </text>
            <text x="28" y="94" textAnchor="middle">
              H
            </text>
          </g>
        </svg>
        <div className="flex flex-col gap-2 text-sm" dir="ltr">
          <Formula
            label={t('guides.docs.weight.volumetric')}
            value="L × W × H (cm) ÷ 6000"
          />
          <Formula label={t('guides.docs.weight.actual')} value="kg" />
          <Formula
            strong
            label={t('guides.docs.weight.chargeable')}
            value={t('guides.docs.weight.chargeable_rule')}
          />
          <p className="text-muted-foreground tabular-nums" dir="auto">
            {t('guides.docs.weight.example')}
          </p>
        </div>
      </div>
    </Figure>
  );
}

function Formula({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg border px-3 py-2',
        strong && 'border-primary/40 bg-primary/5 font-semibold',
      )}
    >
      <span dir="auto">{label}</span>
      <code className="font-mono text-xs" dir="auto">
        {value}
      </code>
    </div>
  );
}

const CASCADE = ['cif', 'duty', 'purchase_tax', 'landed', 'vat'] as const;

/** How the taxes stack: each layer is computed on top of the one before it. */
export function TaxCascadeDiagram() {
  const { t } = useTranslation();
  return (
    <Figure caption={t('guides.docs.cascade.caption')}>
      <ol className="flex flex-col gap-1.5">
        {CASCADE.map((key, i) => (
          <li
            key={key}
            className="flex flex-col gap-0.5 rounded-lg border bg-background px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            style={{ marginInlineStart: `${i * 0.75}rem` }}
          >
            <span className="font-semibold">
              {t(`guides.docs.cascade.${key}`)}
            </span>
            <code
              className="font-mono text-xs text-muted-foreground"
              dir="auto"
            >
              {t(`guides.docs.cascade.${key}_formula`)}
            </code>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
