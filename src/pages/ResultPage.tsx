import { SaveButton } from '@/features/history';
import { ResultView } from '@/features/result';

export function ResultPage() {
  return (
    <ResultView
      actions={({ link, result }) => (
        <SaveButton link={link} totals={result.totals} />
      )}
    />
  );
}
