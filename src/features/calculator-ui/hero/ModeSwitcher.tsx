import { Container, Plane } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { CalculationInput } from '@/features/calc-engine';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';

const MODES = [
  {
    mode: 'standard',
    path: '/',
    labelKey: 'hero.mode.standard',
    Icon: Container,
  },
  {
    mode: 'air-shipment',
    path: '/air-shipment',
    labelKey: 'hero.mode.air',
    Icon: Plane,
  },
] as const;

/** Segmented control of real links: each mode is its own page. */
export function ModeSwitcher({ mode }: { mode: CalculationInput['mode'] }) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('hero.mode_label')}>
      <ul className="inline-flex rounded-full border bg-muted/80 p-1 shadow-xs">
        {MODES.map(({ mode: itemMode, path, labelKey, Icon }) => {
          const active = itemMode === mode;
          return (
            <li key={path}>
              <Link
                to={path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <m.span
                    layoutId="mode-switcher-thumb"
                    transition={spring.indicator}
                    className="absolute inset-0 rounded-full bg-card shadow-sm ring-1 ring-border"
                  />
                )}
                <Icon className="relative size-4" aria-hidden />
                <span className="relative">{t(labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
