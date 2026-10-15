import type { Step, StepLabel } from '@/features/calc-engine';

type T = (key: string, params?: Record<string, unknown>) => string;

export type ValueStep = Extract<Step, { value: unknown }>;
export type BreakdownSection = {
  title: string;
  /** The header's i18n key, e.g. `result.steps.vat_calculation`. */
  key?: string;
  steps: ValueStep[];
};

/** Translated text of a step label; Custom Expenses keep the user's name. */
export function stepLabelText(label: StepLabel, t: T): string {
  if ('text' in label) return label.text;
  const { basis, ...params } = label.params ?? {};
  const text = t(label.key, params);
  return basis ? `${text} (${t(`result.steps.${basis}`)})` : text;
}

/** Groups engine steps under their headers, dropping dividers and empty sections. */
export function toBreakdownSections(steps: Step[], t: T): BreakdownSection[] {
  const sections: BreakdownSection[] = [];
  for (const step of steps) {
    if (step.kind === 'header')
      sections.push({
        title: stepLabelText(step.label, t),
        key: 'key' in step.label ? step.label.key : undefined,
        steps: [],
      });
    else if (step.kind !== 'divider') sections.at(-1)?.steps.push(step);
  }
  return sections.filter(section => section.steps.length > 0);
}
