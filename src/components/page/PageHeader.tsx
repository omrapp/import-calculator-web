import * as m from 'motion/react-m';
import type { ReactNode } from 'react';

import { Photo, type PhotoName } from '@/components/photo';
import { cn } from '@/lib/utils';
import { fadeUp, staggerChildren } from '@/lib/motion';

/** The page's `h1` block, shared by every page except the calculator hero. */
export function PageHeader({
  title,
  icon,
  description,
  meta,
  actions,
  photo,
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
  /** Full-bleed shipping photo behind the header, with light text on a scrim. */
  photo?: PhotoName;
  className?: string;
}) {
  return (
    <m.header
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      data-photo={photo ? '' : undefined}
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        photo &&
          'relative isolate min-h-56 overflow-hidden rounded-3xl px-5 pt-16 pb-7 text-white shadow-md sm:min-h-64 sm:px-8 sm:pb-8',
        className,
      )}
    >
      {photo && (
        <>
          <Photo
            name={photo}
            eager
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="absolute inset-0 -z-20 size-full"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />
        </>
      )}
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
              className={cn(
                'max-w-prose',
                photo ? 'text-white/85' : 'text-muted-foreground',
              )}
            >
              {description}
            </m.div>
          )}
          {meta && (
            <m.div
              variants={fadeUp}
              className={cn(
                'flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm',
                photo ? 'text-white/75' : 'text-muted-foreground',
              )}
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
