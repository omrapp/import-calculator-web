import { BookOpen, History, Ship } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { fadeUp, staggerChildren } from '@/lib/motion';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <m.section
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      className="mx-auto flex max-w-md flex-col items-center gap-5 py-12 text-center sm:py-20"
    >
      <m.span
        variants={fadeUp}
        aria-hidden
        className="grid size-20 place-items-center rounded-3xl bg-linear-to-br from-brand to-highlight text-white shadow-lg"
      >
        <Ship className="size-10" />
      </m.span>
      <m.p
        variants={fadeUp}
        aria-hidden
        className="text-overline text-muted-foreground tabular-nums"
      >
        404
      </m.p>
      <m.h1 variants={fadeUp} className="text-title">
        {t('pages.not_found')}
      </m.h1>
      <m.p variants={fadeUp} className="text-muted-foreground">
        {t('pages.not_found_body')}
      </m.p>
      <m.div variants={fadeUp} className="flex flex-col items-center gap-3">
        <Button asChild size="lg">
          <Link to="/">{t('pages.back_to_calculator')}</Link>
        </Button>
        <div className="flex gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link to="/guides">
              <BookOpen />
              {t('nav.guides_short')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/history">
              <History />
              {t('nav.history')}
            </Link>
          </Button>
        </div>
      </m.div>
    </m.section>
  );
}
