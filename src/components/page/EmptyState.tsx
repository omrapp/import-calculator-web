import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Nothing to show yet: an icon, a line or two, and the way forward. */
export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon: ReactNode;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card/50 px-6 py-10 text-center',
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground ring-1 ring-highlight/20 ring-inset [&_svg]:size-6"
      >
        {icon}
      </span>
      {title && <p className="text-base font-semibold">{title}</p>}
      {children && (
        <div className="max-w-sm text-sm text-muted-foreground">{children}</div>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
