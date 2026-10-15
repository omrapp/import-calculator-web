import { useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

/** Equirectangular point in the map's 360×140 viewBox (lat 80° … −60°). */
type Point = [number, number];
const at = (lon: number, lat: number): Point => [lon + 180, 80 - lat];

const HAIFA = at(35, 32.8);
const ASHDOD = at(34.65, 31.8);
const EILAT = at(34.95, 29.55);
const BEN_GURION = at(34.9, 32);

// Simplified shipping lanes: Asia via Malacca and Suez, India via Bab-el-Mandeb
// up the Red Sea to Eilat, Europe and the Americas through Gibraltar.
const SEA_ROUTES: { id: string; points: Point[] }[] = [
  {
    id: 'asia',
    points: [
      at(121.5, 31.2),
      at(122, 25),
      at(114.2, 19.5),
      at(109, 10),
      at(103.8, 1.3),
      at(95, 5.5),
      at(80.5, 5.2),
      at(60, 12.5),
      at(48, 12.4),
      at(43.4, 12.6),
      at(38.5, 20),
      at(33.8, 27.5),
      at(32.6, 30),
      at(32.4, 31.6),
      HAIFA,
    ],
  },
  {
    id: 'india',
    points: [
      at(72.9, 19),
      at(62, 15),
      at(48, 12.2),
      at(43.4, 12.6),
      at(38.5, 20),
      at(34.6, 27.6),
      EILAT,
    ],
  },
  {
    id: 'europe',
    points: [
      at(4.5, 51.9),
      at(1.5, 50.8),
      at(-5.5, 48.8),
      at(-10, 43),
      at(-9.6, 37.2),
      at(-5.6, 35.9),
      at(0, 37.4),
      at(10.5, 37.6),
      at(20, 35),
      at(28, 33.6),
      ASHDOD,
    ],
  },
  {
    id: 'americas',
    points: [
      at(-74, 40.6),
      at(-52, 39.8),
      at(-28, 37.8),
      at(-10, 36.4),
      at(-5.6, 35.9),
      at(2, 37.6),
      at(12, 36.5),
      at(22, 34.6),
      at(29, 34),
      HAIFA,
    ],
  },
];

/** Air lanes arc north of the straight line, like great circles do. */
const AIR_ROUTES: { id: string; from: Point; lift: number }[] = [
  { id: 'air-asia', from: at(113.9, 22.4), lift: 26 },
  { id: 'air-americas', from: at(-73.8, 40.6), lift: 30 },
];

const ORIGINS: { key: string; point: Point; anchor: 'start' | 'end' }[] = [
  { key: 'shanghai', point: at(121.5, 31.2), anchor: 'start' },
  { key: 'mumbai', point: at(72.9, 19), anchor: 'end' },
  { key: 'rotterdam', point: at(4.5, 51.9), anchor: 'end' },
  { key: 'new_york', point: at(-74, 40.6), anchor: 'end' },
];

const fmt = ([x, y]: Point) => `${+x.toFixed(2)} ${+y.toFixed(2)}`;

/** Catmull-Rom spline through the points, as cubic Béziers. */
function smooth(points: Point[]) {
  let d = `M${fmt(points[0])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const [x1, y1] = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: Point = [x1 + (p2[0] - p0[0]) / 6, y1 + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - x1) / 6, p2[1] - (p3[1] - y1) / 6];
    d += `C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }
  return d;
}

const arc = (from: Point, to: Point, lift: number) =>
  `M${fmt(from)}Q${fmt([(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - lift])} ${fmt(to)}`;

const ROUTES = [
  ...SEA_ROUTES.map(({ id, points }) => ({
    id,
    d: smooth(points),
    air: false,
  })),
  ...AIR_ROUTES.map(({ id, from, lift }) => ({
    id,
    d: arc(from, BEN_GURION, lift),
    air: true,
  })),
];

/**
 * Dot-matrix world map with the main sea and air lanes into Israel's ports.
 * The dots are public/maps/world-dots.svg used as a CSS mask, so they take
 * the theme's color. Geography never mirrors, so the figure stays LTR.
 */
export function ShippingMap({ className }: { className?: string }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <figure className={cn('flex flex-col gap-4', className)}>
      <div dir="ltr" className="relative aspect-[360/140] w-full">
        <div
          aria-hidden
          className="absolute inset-0 bg-muted-foreground/30 [mask:url(/maps/world-dots.svg)_center/contain_no-repeat]"
        />
        <svg
          viewBox="0 0 360 140"
          role="img"
          aria-label={t('landing.map.aria')}
          className="absolute inset-0 size-full overflow-visible"
        >
          {ROUTES.map(({ id, d, air }) => (
            <g
              key={id}
              fill="none"
              strokeLinecap="round"
              className={air ? 'text-highlight' : 'text-link'}
            >
              <path
                id={`route-${id}`}
                d={d}
                stroke="currentColor"
                strokeOpacity={air ? 0.55 : 0.35}
                strokeWidth={air ? 0.7 : 1.1}
                strokeDasharray={air ? '1.6 2' : undefined}
              />
              {!air && (
                <path
                  d={d}
                  stroke="currentColor"
                  strokeWidth={1.1}
                  strokeDasharray="3 9"
                  className="animate-route-flow"
                />
              )}
              {!reduceMotion && (
                <circle r={air ? 1.1 : 1.4} fill="currentColor">
                  <animateMotion
                    dur={air ? '6s' : '14s'}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#route-${id}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          ))}

          {ORIGINS.map(({ key, point: [x, y], anchor }) => (
            <g key={key} className="text-foreground">
              <circle
                cx={x}
                cy={y}
                r={1.6}
                className="fill-card stroke-link"
                strokeWidth={0.8}
              />
              <text
                x={x + (anchor === 'start' ? 3.5 : -3.5)}
                y={y + 1.4}
                textAnchor={anchor}
                className="fill-current text-[4px] font-semibold max-sm:hidden"
              >
                {t(`landing.map.origins.${key}`)}
              </text>
            </g>
          ))}

          <g className="text-highlight">
            <circle
              cx={HAIFA[0]}
              cy={HAIFA[1] + 1.5}
              r={5}
              fill="currentColor"
              fillOpacity={0.18}
            >
              {!reduceMotion && (
                <animate
                  attributeName="r"
                  values="3;7;3"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle
              cx={HAIFA[0]}
              cy={HAIFA[1] + 1.5}
              r={2}
              fill="currentColor"
            />
            <text
              x={HAIFA[0] + 4}
              y={HAIFA[1] - 3}
              className="fill-foreground text-[4.5px] font-bold max-sm:hidden"
            >
              {t('landing.map.israel')}
            </text>
          </g>
        </svg>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-1 w-6 rounded-full bg-link" />
          {t('landing.map.sea')}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-0 w-6 border-t-2 border-dashed border-highlight"
          />
          {t('landing.map.air')}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-highlight" />
          {t('landing.map.ports')}
        </span>
      </figcaption>
    </figure>
  );
}
