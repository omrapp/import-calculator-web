import type { ReactNode } from 'react';

import { Reveal } from '@/components/motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Tone } from '@/lib/tone';

/**
 * A numbered form step. The number comes from a CSS counter on the form
 * (`counter-reset: calc-section`), so sections that only show in one mode
 * keep the sequence right. Each section has its own tone (see index.css),
 * matching the colors of its part on the Result page.
 */
export function Section({
  title,
  icon,
  tone,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  tone: Tone;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <Card
        data-tone={tone}
        className="relative gap-4 overflow-hidden border-tone/35 py-5 [counter-increment:calc-section] sm:py-6"
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-tone-gloss"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-tone-soft to-transparent"
        />
        <CardHeader className="relative flex flex-row items-center justify-between gap-3 px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-tone-gloss text-black/75 shadow-xs ring-1 ring-white/50 ring-inset [&_svg]:size-4.5"
            >
              {icon}
            </span>
            <div className="flex flex-col">
              <span
                aria-hidden
                className="text-overline text-tone-ink before:content-[counter(calc-section,decimal-leading-zero)]"
              />
              <h2 className="text-lg leading-tight font-semibold">{title}</h2>
            </div>
          </div>
          {action}
        </CardHeader>
        <CardContent className="relative flex flex-col gap-2 px-5 sm:px-6">
          {children}
        </CardContent>
      </Card>
    </Reveal>
  );
}
