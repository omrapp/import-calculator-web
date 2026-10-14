import { useTranslation } from 'react-i18next';

export function EmptyState() {
  const { t } = useTranslation();
  return (
    <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
      {t('guides.no_results')}
    </p>
  );
}
