import { ExportMenu } from '@/features/export';
import { SaveButton } from '@/features/history';
import { ResultView } from '@/features/result';

export function ResultPage() {
  return (
    <ResultView
      actions={({ link, result, content }) => (
        <>
          <SaveButton link={link} totals={result.totals} />
          <ExportMenu link={link} result={result} content={content} />
        </>
      )}
    />
  );
}
