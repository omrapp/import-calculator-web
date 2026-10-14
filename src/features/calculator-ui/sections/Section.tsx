import type { ReactNode } from 'react';

import { Reveal } from '@/components/motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * A numbered form step. The number comes from a CSS counter on the form
 * (`counter-reset: calc-section`), so sections that only show in one mode
 * keep the sequence right.
 */
export function Section({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <Card className="gap-4 py-5 [counter-increment:calc-section] sm:py-6">
        <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground ring-1 ring-highlight/20 ring-inset [&_svg]:size-4.5"
            >
              {icon}
            </span>
            <div className="flex flex-col">
              <span
                aria-hidden
                className="text-overline text-muted-foreground before:content-[counter(calc-section,decimal-leading-zero)]"
              />
              <h2 className="text-lg leading-tight font-semibold">{title}</h2>
            </div>
          </div>
          {action}
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-5 sm:px-6">
          {children}
        </CardContent>
      </Card>
    </Reveal>
  );
}
