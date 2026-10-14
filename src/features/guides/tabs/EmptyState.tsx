import { SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { EmptyState as SharedEmptyState } from '@/components/page';

export function EmptyState() {
  const { t } = useTranslation();
  return (
    <SharedEmptyState icon={<SearchX />}>
      {t('guides.no_results')}
    </SharedEmptyState>
  );
}
