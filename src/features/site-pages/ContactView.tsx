import { Mail, MessageSquare, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/page';
import { Button } from '@/components/ui/button';

import { CONTACT_EMAIL } from './content/types';

const mailtoHref = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export function ContactView() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex max-w-prose-tight flex-col gap-6">
      <PageHeader
        icon={<MessageSquare />}
        title={t('nav.contact')}
        description={t('pages.contact.intro')}
      />
      <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground"
          >
            <Mail className="size-6" />
          </span>
          <p className="min-w-0 text-lg font-semibold break-all">
            <bdi dir="ltr">{CONTACT_EMAIL}</bdi>
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <a href={mailtoHref(t('pages.contact.subject'))}>
            <Send className="rtl:-scale-x-100" />
            {t('pages.contact.send_email')}
          </a>
        </Button>
      </div>
    </section>
  );
}
