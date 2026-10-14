import { useTranslation } from 'react-i18next';

import { Logo } from './Logo';

/**
 * Logo and a navy rule at the top of a downloaded image. Hidden on screen and
 * in print; shown only while an ancestor has `data-exporting` (see png.ts).
 */
export function ExportBrandHeader() {
  const { t } = useTranslation();
  return (
    <div className="hidden items-center justify-between gap-4 border-b-2 border-brand pb-3 [[data-exporting]_&]:flex">
      <Logo size="sm" />
      <span className="text-xs text-muted-foreground">
        {t('pages.estimate_only')}
      </span>
    </div>
  );
}
