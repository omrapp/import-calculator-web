import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { Carton } from '@/features/calc-engine';
import { formatNumber, useLanguage } from '@/features/i18n';
import type { Tone } from '@/lib/tone';
import { cn } from '@/lib/utils';

/** Small drawing of the shipment: a container ship at sea or a cargo plane. */
export function SceneArt({
  scene,
  className,
}: {
  scene: 'sea' | 'air';
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 100"
      aria-hidden
      className={cn('text-tone-ink', className)}
    >
      <rect width="160" height="100" rx="14" className="fill-tone-soft" />
      <circle cx="132" cy="24" r="10" className="fill-tone opacity-60" />
      {scene === 'sea' ? <Ship /> : <Plane />}
    </svg>
  );
}

function Ship() {
  return (
    <g>
      {/* Containers, three colours like a real stack */}
      {[
        [38, 44, 'fill-tone'],
        [58, 44, 'fill-tone/55'],
        [78, 44, 'fill-tone'],
        [48, 32, 'fill-tone/55'],
        [68, 32, 'fill-tone'],
        [98, 44, 'fill-tone/55'],
      ].map(([x, y, fill]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="18"
          height="11"
          rx="1.5"
          className={String(fill)}
          stroke="currentColor"
          strokeOpacity="0.35"
        />
      ))}
      <rect x="118" y="34" width="12" height="21" rx="2" fill="currentColor" />
      <path d="M24 56h120l-12 18H38z" fill="currentColor" fillOpacity="0.85" />
      <path
        d="M8 82q8-5 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0 16 0"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function Plane() {
  return (
    <g>
      <path
        d="M26 58c0-4 3-7 8-7h78c10 0 20 3 24 7-4 4-14 7-24 7H34c-5 0-8-3-8-7z"
        fill="currentColor"
      />
      <path d="M70 52 52 22h12l28 30z" className="fill-tone" />
      <path d="M70 64 58 88h12l22-24z" className="fill-tone" />
      <path d="M30 52 22 36h9l12 16z" fill="currentColor" />
      {[86, 96, 106, 116].map(x => (
        <circle key={x} cx={x} cy="57" r="2.2" className="fill-tone-soft" />
      ))}
      <path
        d="M10 76h22M4 84h18M14 92h14"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * A carton drawn in 3D with its measures, plus its volumetric weight:
 * L × W × H ÷ divisor × quantity.
 */
export function CartonFigure({
  carton,
  divisor,
  label,
}: {
  carton: Carton;
  divisor: number;
  label: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const n = (value: number, digits = 2) =>
    formatNumber(value, language, digits, 0);
  const volumetric =
    ((carton.length * carton.width * carton.height) / divisor) *
    carton.quantity;
  const actual = carton.weight * carton.quantity;

  return (
    <figure className="flex flex-col gap-3 rounded-xl border border-tone/40 bg-tone-soft/50 p-4">
      <figcaption className="text-sm font-semibold text-tone-ink">
        {label}
      </figcaption>
      <div className="flex items-center gap-4">
        <svg
          viewBox="0 0 150 120"
          role="img"
          aria-label={t('examples.carton.aria', {
            length: n(carton.length),
            width: n(carton.width),
            height: n(carton.height),
          })}
          className="w-36 shrink-0 text-tone-ink"
        >
          {/* front, top and side faces of the box */}
          <path d="M20 45h70v60H20z" className="fill-tone/55" />
          <path d="M20 45l25-22h70L90 45z" className="fill-tone" />
          <path d="M90 45l25-22v60l-25 22z" className="fill-tone/80" />
          <path
            d="M20 45h70v60H20zM20 45l25-22h70L90 45M90 105l25-22V23"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M50 34 65 23M30 45v10"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="6"
          />
          <g
            fill="currentColor"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >
            <text x="55" y="118" direction="ltr">
              {n(carton.length)}
            </text>
            <text x="112" y="104" direction="ltr">
              {n(carton.width)}
            </text>
            <text x="8" y="79" direction="ltr">
              {n(carton.height)}
            </text>
          </g>
        </svg>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-muted-foreground">{t('examples.carton.size')}</dt>
          <dd>
            <bdi dir="ltr">
              {n(carton.length)} × {n(carton.width)} × {n(carton.height)}{' '}
              {t('common.cm')}
            </bdi>
          </dd>
          <dt className="text-muted-foreground">{t('home.labels.quantity')}</dt>
          <dd>
            <bdi dir="ltr">× {n(carton.quantity)}</bdi>
          </dd>
          <dt className="text-muted-foreground">
            {t('examples.carton.weight_each')}
          </dt>
          <dd>
            <bdi dir="ltr">
              {n(carton.weight)} {t('common.kg')}
            </bdi>
          </dd>
        </dl>
      </div>
      <dl className="flex flex-col gap-1 border-t border-tone/30 pt-3 text-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <dt>{t('result.steps.volumetric_weight')}</dt>
          <dd className="tabular-nums">
            <bdi dir="ltr">
              ({n(carton.length)} × {n(carton.width)} × {n(carton.height)}) ÷{' '}
              {n(divisor)} × {n(carton.quantity)} ={' '}
              <strong>
                {n(volumetric)} {t('common.kg')}
              </strong>
            </bdi>
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <dt>{t('result.steps.actual_weight')}</dt>
          <dd className="tabular-nums">
            <bdi dir="ltr">
              {n(carton.weight)} × {n(carton.quantity)} ={' '}
              <strong>
                {n(actual)} {t('common.kg')}
              </strong>
            </bdi>
          </dd>
        </div>
      </dl>
    </figure>
  );
}

const FLOW: { key: string; tone: Tone }[] = [
  { key: 'cif', tone: 'cif' },
  { key: 'duty', tone: 'duty' },
  { key: 'purchase_tax', tone: 'ptax' },
  { key: 'expenses', tone: 'expenses' },
  { key: 'vat', tone: 'vat' },
  { key: 'total', tone: 'factors' },
];

/** The order every calculation follows, each part adding to the running total. */
export function FlowDiagram() {
  const { t } = useTranslation();
  return (
    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
      {FLOW.map(({ key, tone }, i) => (
        <li
          key={key}
          data-tone={tone}
          className="flex items-stretch gap-0 lg:flex-col lg:items-center"
        >
          <div className="flex flex-1 items-center gap-3 lg:w-full lg:flex-row">
            <div className="flex w-full flex-col gap-1 rounded-xl border border-tone/40 bg-tone-soft p-3 lg:h-full">
              <span className="flex items-center gap-2 text-sm font-semibold text-tone-ink">
                <span
                  aria-hidden
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-tone-gloss text-xs font-bold text-black/75 shadow-xs"
                >
                  {i + 1}
                </span>
                {t(`examples.flow.${key}.title`)}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(`examples.flow.${key}.formula`)}
              </span>
            </div>
            {i < FLOW.length - 1 && (
              <ArrowRight
                aria-hidden
                className="hidden size-4 shrink-0 text-muted-foreground lg:block rtl:-scale-x-100"
              />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
