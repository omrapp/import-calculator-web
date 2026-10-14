import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section>
      <h1 className="text-2xl font-semibold">{t('pages.not_found')}</h1>
      <Button asChild className="mt-4">
        <Link to="/">{t('pages.back_to_calculator')}</Link>
      </Button>
    </section>
  );
}
