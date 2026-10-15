import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Calculator,
  Download,
  Globe,
  History,
  Languages,
  type LucideIcon,
  Plane,
  TrendingUp,
  UserRoundX,
} from 'lucide-react';
import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { TrustChip } from '@/features/calculator-ui';
import { SampleCostChart } from '@/features/guides';
import { fadeUp, staggerChildren } from '@/lib/motion';

const FEATURES: [string, LucideIcon][] = [
  ['standard', Calculator],
  ['air', Plane],
  ['rates', TrendingUp],
  ['history', History],
  ['export', Download],
  ['languages', Languages],
];

const STEPS = ['step1', 'step2', 'step3'] as const;

const LEARN: { key: string; path: string; Icon: LucideIcon }[] = [
  { key: 'guides', path: '/guides', Icon: BookOpen },
  { key: 'websites', path: '/websites', Icon: Globe },
];

/** Arrow that points forward in the reading direction. */
const Forward = () => <ArrowRight aria-hidden className="rtl:rotate-180" />;

function SectionHeading({
  id,
  overline,
  title,
  lead,
}: {
  id: string;
  overline: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal className="flex max-w-2xl flex-col gap-2">
      <p className="text-overline text-link uppercase">{overline}</p>
      <h2 id={id} className="text-title">
        {title}
      </h2>
      {lead && <p className="text-muted-foreground sm:text-lg">{lead}</p>}
    </Reveal>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground ring-1 ring-highlight/20 ring-inset [&_svg]:size-5"
    >
      {children}
    </span>
  );
}

/** Landing page: what the site does, how it works, and where to start. */
export function HomeView() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      <section
        aria-labelledby="home-title"
        className="relative isolate grid items-center gap-10 overflow-hidden rounded-3xl border bg-card px-5 py-10 shadow-sm sm:px-10 sm:py-14 lg:grid-cols-[1.15fr_1fr]"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dot-grid mask-b-from-20% mask-b-to-100%"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow" />

        <m.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="flex flex-col items-start gap-5"
        >
          <m.p variants={fadeUp} className="text-overline text-link uppercase">
            {t('landing.overline')}
          </m.p>
          <m.h1 variants={fadeUp} id="home-title" className="text-display">
            {t('landing.title')}
          </m.h1>
          <m.p
            variants={fadeUp}
            className="max-w-prose text-muted-foreground sm:text-lg"
          >
            {t('landing.lead')}
          </m.p>
          <m.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/calculator">
                <Calculator />
                {t('landing.cta_start')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/air-shipment">
                <Plane />
                {t('landing.cta_air')}
              </Link>
            </Button>
          </m.div>
          <m.ul variants={fadeUp} className="flex flex-wrap gap-2">
            <TrustChip
              icon={
                <span
                  aria-hidden
                  className="mx-0.5 size-2 animate-live-dot rounded-full bg-highlight"
                />
              }
            >
              {t('hero.trust.rates')}
            </TrustChip>
            <TrustChip icon={<BadgeCheck aria-hidden />}>
              {t('hero.trust.free')}
            </TrustChip>
            <TrustChip icon={<UserRoundX aria-hidden />}>
              {t('hero.trust.no_signup')}
            </TrustChip>
          </m.ul>
        </m.div>

        <Reveal className="min-w-0 [&_figure]:shadow-md">
          <SampleCostChart />
        </Reveal>
      </section>

      <section aria-labelledby="home-features" className="flex flex-col gap-8">
        <SectionHeading
          id="home-features"
          overline={t('landing.features.overline')}
          title={t('landing.features.title')}
          lead={t('landing.features.lead')}
        />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([feature, Icon]) => (
            <RevealItem
              key={feature}
              className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-xs"
            >
              <IconTile>
                <Icon />
              </IconTile>
              <h3 className="font-semibold">
                {t(`landing.features.${feature}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`landing.features.${feature}.body`)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="home-how" className="flex flex-col gap-8">
        <SectionHeading
          id="home-how"
          overline={t('landing.how.overline')}
          title={t('landing.how.title')}
        />
        <RevealGroup className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <RevealItem
              key={step}
              className="relative flex flex-col gap-2 rounded-2xl border bg-card p-5 shadow-xs"
            >
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground tabular-nums"
              >
                {i + 1}
              </span>
              <h3 className="pt-1 font-semibold">
                {t(`landing.how.${step}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`landing.how.${step}.body`)}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="home-learn" className="flex flex-col gap-8">
        <SectionHeading
          id="home-learn"
          overline={t('landing.learn.overline')}
          title={t('landing.learn.title')}
          lead={t('landing.learn.lead')}
        />
        <RevealGroup className="grid gap-4 md:grid-cols-2">
          {LEARN.map(({ key, path, Icon }) => (
            <RevealItem key={key}>
              <Link
                to={path}
                className="group flex h-full items-start gap-4 rounded-2xl border bg-card p-6 shadow-xs transition-shadow duration-150 outline-none hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
              >
                <IconTile>
                  <Icon />
                </IconTile>
                <span className="flex flex-col gap-1.5">
                  <span className="text-lg font-semibold">
                    {t(`landing.learn.${key}.title`)}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.learn.${key}.body`)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-link [&_svg]:size-4 [&_svg]:transition-transform group-hover:[&_svg]:translate-x-0.5 rtl:group-hover:[&_svg]:-translate-x-0.5">
                    {t(`landing.learn.${key}.cta`)}
                    <Forward />
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Reveal>
        <section
          aria-labelledby="home-final"
          className="flex flex-col items-start gap-5 rounded-3xl bg-footer px-6 py-10 text-footer-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10"
        >
          <div className="flex flex-col gap-2">
            <h2 id="home-final" className="text-title text-white">
              {t('landing.final.title')}
            </h2>
            <p className="text-footer-muted">{t('landing.final.body')}</p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link to="/calculator">
              {t('landing.cta_start')}
              <Forward />
            </Link>
          </Button>
        </section>
      </Reveal>
    </div>
  );
}
