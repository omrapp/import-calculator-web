import { CircleAlert, Info, Lightbulb, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

export type CalloutKind = 'tip' | 'note' | 'warning';

const STYLE: Record<CalloutKind, { icon: LucideIcon; box: string }> = {
  tip: {
    icon: Lightbulb,
    box: 'border-emerald-500/30 bg-emerald-500/8 [&_svg]:text-emerald-700 dark:[&_svg]:text-emerald-300',
  },
  note: {
    icon: Info,
    box: 'border-sky-500/30 bg-sky-500/8 [&_svg]:text-sky-700 dark:[&_svg]:text-sky-300',
  },
  warning: {
    icon: CircleAlert,
    box: 'border-amber-500/40 bg-amber-500/10 [&_svg]:text-amber-700 dark:[&_svg]:text-amber-300',
  },
};

/** Tip / note / warning box. The kind is named in text, never by colour alone. */
export function Callout({
  kind,
  children,
}: {
  kind: CalloutKind;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { icon: Icon, box } = STYLE[kind];
  return (
    <aside
      className={cn(
        'flex gap-3 rounded-xl border p-4 text-sm leading-relaxed',
        box,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4.5 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{t(`guides.docs.callout.${kind}`)}</p>
        <div className="text-foreground/90">{children}</div>
      </div>
    </aside>
  );
}
