import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  type CalculationLink,
  type CalculationTotals,
  encodeCalculation,
} from '@/features/calc-engine';

import { saveCalculation } from './storage';
import { useHistory } from './useHistory';

export function SaveButton({
  link,
  totals,
}: {
  link: CalculationLink;
  totals: CalculationTotals;
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const encoded = encodeCalculation(link);
  const saved = history.some(item => encodeCalculation(item.link) === encoded);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={saved}
      onClick={() => saveCalculation(link, totals)}
    >
      {saved ? <BookmarkCheck /> : <Bookmark />}
      {saved ? t('history.saved') : t('history.save')}
    </Button>
  );
}
