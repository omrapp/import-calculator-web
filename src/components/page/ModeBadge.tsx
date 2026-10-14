import { Container, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

/** Which calculator a figure came from: Standard or Air Shipment. */
export function ModeBadge({
  mode,
  className,
}: {
  mode: 'standard' | 'air-shipment';
  className?: string;
}) {
  const { t } = useTranslation();
  const Icon = mode === 'standard' ? Container : Plane;
  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit items-center gap-1.5 rounded-full bg-accent px-2.5 text-xs font-medium text-accent-foreground',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {t(mode === 'standard' ? 'nav.standard' : 'nav.air_shipment')}
    </span>
  );
}
