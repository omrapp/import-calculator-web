import type { ReactNode } from 'react';

export function TrustChip({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="inline-flex h-7 shrink-0 items-center whitespace-nowrap gap-1.5 rounded-full border bg-card/80 px-2.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur-sm [&_svg]:size-3.5 [&_svg]:text-link">
      {icon}
      {children}
    </li>
  );
}
