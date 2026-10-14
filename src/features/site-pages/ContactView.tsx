import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

import { CONTACT_EMAIL } from './content/types';

const mailtoHref = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export function ContactView() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">{t('nav.contact')}</h1>
      <p>{t('pages.contact.intro')}</p>
      <p className="text-lg font-medium">
        <bdi dir="ltr">{CONTACT_EMAIL}</bdi>
      </p>
      <Button asChild>
        <a href={mailtoHref(t('pages.contact.subject'))}>
          <Mail />
          {t('pages.contact.send_email')}
        </a>
      </Button>
    </section>
  );
}
