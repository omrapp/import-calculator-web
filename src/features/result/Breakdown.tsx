import { useTranslation } from 'react-i18next';

import { Reveal } from '@/components/motion';

import type { Step } from '@/features/calc-engine';
import { useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

import { formatStepValue } from './format';
import { Formula } from './Formula';
import { stepLabelText, toBreakdownSections } from './sections';

export function Breakdown({ steps }: { steps: Step[] }) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <section aria-label={t('result.breakdown')} className="flex flex-col gap-4">
      <h2 className="mt-2 text-xl font-semibold">{t('result.breakdown')}</h2>
      {toBreakdownSections(steps, t).map(section => (
        <Reveal
          key={section.title}
          className="break-inside-avoid overflow-hidden rounded-xl border bg-card shadow-xs"
        >
          <h3 className="border-b bg-muted/60 px-4 py-2.5 text-sm font-semibold sm:px-5">
            {section.title}
          </h3>
          <ul className="divide-y">
            {section.steps.map((step, i) => (
              <li
                key={i}
                className={cn(
                  'flex flex-col gap-0.5 px-4 py-2.5 sm:px-5',
                  step.kind === 'subtotal' && 'bg-muted/40 font-medium',
                  step.kind === 'total' &&
                    'bg-accent font-semibold text-accent-foreground',
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span>{stepLabelText(step.label, t)}</span>
                  <bdi dir="ltr" className="shrink-0 tabular-nums">
                    {formatStepValue(step.value, language, t)}
                  </bdi>
                </div>
                {step.formula && (
                  <span className="text-xs text-muted-foreground">
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
