import { Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

const BADGE_SIZES = {
  sm: 'size-7 rounded-lg [&_svg]:size-4',
  md: 'size-9 rounded-[0.7rem] [&_svg]:size-5',
  lg: 'size-14 rounded-2xl [&_svg]:size-8',
} as const;

type Size = keyof typeof BADGE_SIZES;

/** Ship on a navy → teal square; the same mark as public/favicon.svg. */
export function LogoBadge({
  size = 'md',
  className,
}: {
  size?: Size;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-grid shrink-0 place-items-center overflow-hidden bg-linear-to-br from-brand to-highlight text-white shadow-sm ring-1 ring-white/10 ring-inset',
        'before:absolute before:inset-0 before:bg-linear-to-b before:from-white/20 before:to-transparent before:to-50%',
        BADGE_SIZES[size],
        className,
      )}
    >
      <Ship className="relative" strokeWidth={2} />
    </span>
  );
}

/** Badge + wordmark. The wordmark is the site name, so it names a home link. */
export function Logo({
  size = 'md',
  className,
}: {
  size?: Size;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoBadge size={size} />
      <span className="text-[1.0625rem] font-semibold tracking-heading">
        {t('home.title')}
      </span>
    </span>
  );
}
