import { useTranslation } from 'react-i18next';

import { Reveal } from '@/components/motion';

import type { Step } from '@/features/calc-engine';
import { useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

import { formatStepValue } from './format';
import { Formula } from './Formula';
import { stepLabelText, toBreakdownSections } from './sections';
import { sectionTone } from './tones';

export function Breakdown({ steps }: { steps: Step[] }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <section
      aria-label={t('result.breakdown')}
      className="flex flex-col gap-4 [counter-reset:breakdown]"
    >
      <h2 className="mt-2 text-xl font-semibold">{t('result.breakdown')}</h2>
      {toBreakdownSections(steps, t).map(section => (
        <Reveal
          key={section.title}
          data-tone={sectionTone(section.key)}
          className="break-inside-avoid overflow-hidden rounded-xl border border-tone/40 bg-card shadow-xs"
        >
          <h3 className="flex items-center gap-3 border-b [counter-increment:breakdown] border-tone/30 bg-tone-soft px-4 py-2.5 text-sm font-semibold text-tone-ink sm:px-5">
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-full bg-tone-gloss text-xs font-bold text-black/75 shadow-xs ring-1 ring-white/50 before:content-[counter(breakdown)]"
            />
            {section.title}
          </h3>
          <ul className="divide-y">
            {section.steps.map((step, i) => (
              <li
                key={i}
                className={cn(
                  'flex flex-col gap-0.5 px-4 py-2.5 sm:px-5',
                  step.kind === 'subtotal' &&
                    'bg-tone-soft/60 font-medium text-tone-ink',
                  step.kind === 'total' &&
                    'bg-tone-gloss font-semibold text-black/85',
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span>{stepLabelText(step.label, t)}</span>
                  <bdi dir="ltr" className="shrink-0 tabular-nums">
                    {formatStepValue(step.value, language, t)}
                  </bdi>
                </div>
                {step.formula && (
                  <span
                    className={cn(
                      'text-xs',
                      step.kind === 'total'
                        ? 'text-black/70'
                        : 'text-muted-foreground',
                    )}
                  >
                    <Formula tokens={step.formula} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </section>
  );
}
