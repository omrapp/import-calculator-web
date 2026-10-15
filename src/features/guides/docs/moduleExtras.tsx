import { type ReactNode, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { useLanguage } from '@/features/i18n';

import { galleryItems } from '../data/gallery';
import { Lightbox } from '../Lightbox';
import { Picture } from '../Picture';
import { Callout, type CalloutKind } from './Callout';
import { ChargeableWeightDiagram, TaxCascadeDiagram } from './diagrams';
import { PersonalImportTable } from './PersonalImportTable';
import { SampleCostChart } from './SampleCostChart';

const linkClass =
  'font-medium text-primary underline underline-offset-4 hover:text-primary/80';

/** Callout text with <calc>, <air>, <websites>, <terms> links. */
function CalloutText({ id }: { id: string }) {
  return (
    <Trans
      i18nKey={`guides.docs.module.${id}.callout`}
      components={{
        calc: <Link to="/" className={linkClass} />,
        air: <Link to="/air-shipment" className={linkClass} />,
        websites: <Link to="/websites" className={linkClass} />,
        terms: <Link to="/guides?tab=terms" className={linkClass} />,
      }}
    />
  );
}

function DocumentThumbnails() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const items = galleryItems.map(item => ({
    id: item.id,
    image: item.image,
    title: item.title[language],
    description: item.description[language],
  }));
  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group flex w-full flex-col gap-1.5 rounded-lg text-start text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block aspect-[3/4] overflow-hidden rounded-lg border bg-muted">
                <Picture
                  image={item.image}
                  alt={item.title}
                  sizes="120px"
                  className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="line-clamp-2 text-muted-foreground group-hover:text-foreground">
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        items={items}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
        downloadable
      />
      <p className="text-xs text-muted-foreground">
        {t('guides.docs.documents_caption')}
      </p>
    </div>
  );
}

/** Per-module visuals and a callout, keyed by learning-module id. */
const EXTRAS: Record<
  string,
  { callout: CalloutKind; before?: ReactNode; after?: ReactNode }
> = {
  '1': { callout: 'warning', before: <PersonalImportTable /> },
  '2': { callout: 'tip' },
  '3': { callout: 'tip' },
  '4': { callout: 'note' },
  '5': { callout: 'tip', after: <DocumentThumbnails /> },
  '6': { callout: 'warning' },
  '7': { callout: 'tip', after: <ChargeableWeightDiagram /> },
  '8': { callout: 'warning' },
  '9': { callout: 'note' },
  '10': {
    callout: 'tip',
    after: (
      <div className="grid gap-4 xl:grid-cols-2">
        <TaxCascadeDiagram />
        <SampleCostChart />
      </div>
    ),
  },
};

export function ModuleExtras({
  id,
  slot,
}: {
  id: string;
  slot: 'before' | 'after';
}) {
  const extras = EXTRAS[id];
  if (!extras) return null;
  if (slot === 'before') return extras.before ?? null;
  return (
    <>
      {extras.after}
      <Callout kind={extras.callout}>
        <CalloutText id={id} />
      </Callout>
    </>
  );
}
