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
  Ship,
  TrendingUp,
  UserRoundX,
} from 'lucide-react';
import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { Photo, type PhotoName } from '@/components/photo';
import { Button } from '@/components/ui/button';
import { TrustChip } from '@/features/calculator-ui';
import { SampleCostChart } from '@/features/guides';
import { fadeUp, staggerChildren } from '@/lib/motion';

import { ShippingMap } from './ShippingMap';

const FEATURES: [string, LucideIcon][] = [
  ['standard', Calculator],
  ['air', Plane],
  ['rates', TrendingUp],
  ['history', History],
  ['export', Download],
  ['languages', Languages],
];

const STEPS: [string, PhotoName][] = [
  ['step1', 'packing-box'],
  ['step2', 'calculator-dollars'],
  ['step3', 'container-rows-aerial'],
];

const MODES: {
  key: string;
  path: string;
  Icon: LucideIcon;
  photo: PhotoName;
}[] = [
  {
    key: 'sea',
    path: '/calculator',
    Icon: Ship,
    photo: 'ship-at-berth-aerial',
  },
  { key: 'air', path: '/air-shipment', Icon: Plane, photo: 'cargo-plane' },
];

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
        className="relative isolate grid items-center gap-10 overflow-hidden rounded-3xl px-5 py-12 text-white shadow-lg sm:px-10 sm:py-16 lg:grid-cols-[1.15fr_1fr]"
      >
        <Photo
          name="ship-entering-port"
          eager
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="absolute inset-0 -z-20 size-full"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />

        <m.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="flex flex-col items-start gap-5"
        >
          <m.p
            variants={fadeUp}
            className="text-overline text-highlight uppercase"
          >
            {t('landing.overline')}
          </m.p>
          <m.h1 variants={fadeUp} id="home-title" className="text-display">
            {t('landing.title')}
          </m.h1>
          <m.p
            variants={fadeUp}
            className="max-w-prose text-white/85 sm:text-lg"
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
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:border-white/40 dark:bg-white/10 dark:hover:bg-white/20"
            >
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

      <section aria-labelledby="home-modes" className="flex flex-col gap-8">
        <SectionHeading
          id="home-modes"
          overline={t('landing.modes.overline')}
          title={t('landing.modes.title')}
          lead={t('landing.modes.lead')}
        />
        <RevealGroup className="grid gap-4 md:grid-cols-2">
          {MODES.map(({ key, path, Icon, photo }) => (
            <RevealItem key={key}>
              <Link
                to={path}
                className="group relative isolate flex min-h-72 flex-col justify-end gap-2 overflow-hidden rounded-3xl p-6 text-white shadow-sm outline-none transition-shadow duration-150 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring sm:min-h-80"
              >
                <Photo
                  name={photo}
                  sizes="(min-width: 768px) 640px, 100vw"
                  className="absolute inset-0 -z-20 size-full [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105 motion-reduce:[&_img]:transition-none"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-photo-scrim"
                />
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm [&_svg]:size-5"
                >
                  <Icon />
                </span>
                <span className="text-xl font-semibold">
                  {t(`landing.modes.${key}.title`)}
                </span>
                <span className="max-w-md text-sm leading-relaxed text-white/85">
                  {t(`landing.modes.${key}.body`)}
                </span>
                <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-highlight [&_svg]:size-4 [&_svg]:transition-transform group-hover:[&_svg]:translate-x-0.5 rtl:group-hover:[&_svg]:-translate-x-0.5">
                  {t(`landing.modes.${key}.cta`)}
                  <Forward />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section
        aria-labelledby="home-map"
        className="flex flex-col gap-8 rounded-3xl border bg-card px-5 py-8 shadow-xs sm:px-8 sm:py-10"
      >
        <SectionHeading
          id="home-map"
          overline={t('landing.map.overline')}
          title={t('landing.map.title')}
          lead={t('landing.map.lead')}
        />
        <Reveal>
          <ShippingMap />
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
          {STEPS.map(([step, photo], i) => (
            <RevealItem
              key={step}
              className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border bg-card shadow-xs"
            >
              <Photo
                name={photo}
                sizes="(min-width: 768px) 420px, 100vw"
                className="aspect-[16/9] w-full"
              />
              <span
                aria-hidden
                className="-mt-7 ms-5 grid size-11 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground tabular-nums ring-4 ring-card"
              >
                {i + 1}
              </span>
              <h3 className="px-5 pt-1 font-semibold">
                {t(`landing.how.${step}.title`)}
              </h3>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
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
          className="relative isolate flex flex-col items-start gap-5 overflow-hidden rounded-3xl bg-footer px-6 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-16"
        >
          <Photo
            name="ship-at-sunset"
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="absolute inset-0 -z-20 size-full"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />
          <div className="flex flex-col gap-2">
            <h2 id="home-final" className="text-title text-white">
              {t('landing.final.title')}
            </h2>
            <p className="text-white/85">{t('landing.final.body')}</p>
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
