import * as m from 'motion/react-m';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { fadeUp, staggerChildren } from '@/lib/motion';

/** The page's `h1` block, shared by every page except the calculator hero. */
export function PageHeader({
  title,
  icon,
  description,
  meta,
  actions,
  className,
}: {
  title: string;
  /** Lucide icon, shown in a tinted badge. */
  icon?: ReactNode;
  description?: ReactNode;
  /** Small print under the description: dates, counts, provenance. */
  meta?: ReactNode;
  /** End-side controls; wrap under the title on small screens. */
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <m.header
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        {icon && (
          <m.span
            variants={fadeUp}
            aria-hidden
            className="mt-0.5 hidden size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground ring-1 ring-highlight/20 ring-inset sm:grid [&_svg]:size-6"
          >
            {icon}
          </m.span>
        )}
        <div className="flex min-w-0 flex-col gap-2">
          <m.h1 variants={fadeUp} className="text-title">
            {title}
          </m.h1>
          {description && (
            <m.div
              variants={fadeUp}
              className="max-w-prose text-muted-foreground"
            >
              {description}
            </m.div>
          )}
          {meta && (
            <m.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground"
            >
              {meta}
            </m.div>
          )}
        </div>
      </div>
      {actions && (
        <m.div variants={fadeUp} className="flex shrink-0 flex-wrap gap-2">
          {actions}
        </m.div>
      )}
    </m.header>
  );
}
