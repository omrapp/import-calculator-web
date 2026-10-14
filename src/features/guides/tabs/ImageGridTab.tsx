import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type LightboxItem, Lightbox } from '../Lightbox';
import { Picture } from '../Picture';
import { EmptyState } from './EmptyState';

/** Card grid of images that open in the Lightbox (Presentation and Gallery). */
export function ImageGridTab({
  items,
  numbered = false,
  downloadable = false,
}: {
  items: LightboxItem[];
  numbered?: boolean;
  downloadable?: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);
  if (items.length === 0) return <EmptyState />;

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card text-start shadow-xs transition-shadow duration-150 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="block overflow-hidden bg-muted">
                <Picture
                  image={item.image}
                  alt=""
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-video object-contain transition-transform duration-300 ease-out-quart motion-safe:group-hover:scale-[1.03]"
                />
              </span>
              <span className="flex flex-col gap-1 p-4">
                {numbered && (
                  <span className="text-overline text-muted-foreground tabular-nums">
                    {t('guides.position', { n: i + 1, total: items.length })}
                  </span>
                )}
                <span className="font-medium">{item.title}</span>
                {item.description && (
                  <span className="text-sm text-muted-foreground">
                    {item.description}
                  </span>
                )}
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
        downloadable={downloadable}
      />
    </>
  );
}
