import { useTranslation } from 'react-i18next';

import type { Step, StepLabel } from '@/features/calc-engine';
import { useLanguage } from '@/features/i18n';
import { cn } from '@/lib/utils';

import { formatStepValue } from './format';
import { Formula } from './Formula';

type ValueStep = Extract<Step, { value: unknown }>;
type Section = { title: string; steps: ValueStep[] };

function useLabel() {
  const { t } = useTranslation();
  return (label: StepLabel): string => {
    if ('text' in label) return label.text;
    const { basis, ...params } = label.params ?? {};
    const text = t(label.key, params);
    return basis ? `${text} (${t(`result.steps.${basis}`)})` : text;
  };
}

function toSections(steps: Step[], label: (l: StepLabel) => string): Section[] {
  const sections: Section[] = [];
  for (const step of steps) {
    if (step.kind === 'header')
      sections.push({ title: label(step.label), steps: [] });
    else if (step.kind !== 'divider') sections.at(-1)?.steps.push(step);
  }
  return sections.filter(section => section.steps.length > 0);
}

export function Breakdown({ steps }: { steps: Step[] }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const label = useLabel();

  return (
    <section aria-label={t('result.breakdown')} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{t('result.breakdown')}</h2>
      {toSections(steps, label).map(section => (
        <section key={section.title} className="rounded-lg border">
          <h3 className="border-b bg-muted px-4 py-2 text-sm font-semibold">
            {section.title}
          </h3>
          <ul className="divide-y">
            {section.steps.map((step, i) => (
              <li
                key={i}
                className={cn(
                  'flex flex-col gap-0.5 px-4 py-2',
                  step.kind === 'subtotal' && 'bg-muted/50 font-medium',
                  step.kind === 'total' && 'bg-primary/10 font-semibold',
                )}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span>{label(step.label)}</span>
                  <bdi dir="ltr" className="tabular-nums">
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
        </section>
      ))}
    </section>
  );
}
