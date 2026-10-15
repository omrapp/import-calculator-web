import { BadgeCheck, SquareSigma, UserRoundX } from 'lucide-react';
import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { CalculationInput } from '@/features/calc-engine';
import { cn } from '@/lib/utils';
import { fadeUp, staggerChildren } from '@/lib/motion';

import { ModeSwitcher } from './ModeSwitcher';
import { TrustChip } from './TrustChip';

/** The calculator page's heading block: title, lead, mode switch, trust chips. */
export function Hero({
  mode,
  title,
  ratesLive,
  action,
}: {
  mode: CalculationInput['mode'];
  title: string;
  /** Bank of Israel rates are loaded (live or cached), so the dot pulses. */
  ratesLive: boolean;
  /** Top-end control, e.g. clear form. */
  action?: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="calculator-title"
      className="relative isolate overflow-hidden rounded-2xl border bg-card px-5 py-5 shadow-sm sm:px-8 sm:py-8"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dot-grid mask-b-from-20% mask-b-to-100%"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow" />

      <m.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="flex flex-col gap-3 sm:gap-5"
      >
        <m.div
          variants={fadeUp}
          className="flex items-start justify-between gap-3"
        >
          <div className="flex flex-col gap-2">
            <h1 id="calculator-title" className="text-display">
              {title}
            </h1>
            <p className="hidden max-w-prose text-muted-foreground sm:block sm:text-lg">
              {t(mode === 'standard' ? 'hero.lead.standard' : 'hero.lead.air')}
            </p>
            <Link
              to="/examples"
              className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SquareSigma aria-hidden className="size-4" />
              {t('examples.see_examples')}
            </Link>
          </div>
          {action}
        </m.div>

        <m.div variants={fadeUp}>
          <ModeSwitcher mode={mode} />
        </m.div>

        <m.ul
          variants={fadeUp}
          className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          <TrustChip
            icon={
              <span
                aria-hidden
                className={cn(
                  'mx-0.5 size-2 rounded-full',
                  ratesLive
                    ? 'animate-live-dot bg-highlight'
                    : 'bg-muted-foreground/50',
                )}
              />
            }
          >
            {t('hero.trust.rates')}
          </TrustChip>
          <TrustChip icon={<BadgeCheck aria-hidden />}>
            {t('hero.trust.free')}
          </TrustChip>
          <TrustChip icon={<UserRoundX aria-hidden />}>
            {t('hero.trust.no_signup')}
          </TrustChip>
        </m.ul>
      </m.div>
    </section>
  );
}
