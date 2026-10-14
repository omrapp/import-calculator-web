import {
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { directionOf, useLanguage } from '@/features/i18n';

import type { ImagePath } from './data/types';
import { Picture } from './Picture';

export type LightboxItem = {
  id: string;
  image: ImagePath;
  title: string;
  description?: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const STEP = 0.5;

/** Full-screen image viewer with zoom and previous/next in reading order. */
export function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
  downloadable = false,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  downloadable?: boolean;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const rtl = directionOf(language) === 'rtl';
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const item = index === null ? null : items[index];

  const go = (delta: number) => {
    if (index === null) return;
    setZoom(MIN_ZOOM);
    onIndexChange((index + delta + items.length) % items.length);
  };
  const zoomBy = (delta: number) =>
    setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));

  // Previous is on the inline-start side, so arrows follow reading direction.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(rtl ? -1 : 1);
    else if (event.key === 'ArrowLeft') go(rtl ? 1 : -1);
    else if (event.key === '+' || event.key === '=') zoomBy(STEP);
    else if (event.key === '-') zoomBy(-STEP);
  };

  return (
    <Dialog
      open={item !== null}
      onOpenChange={open => {
        if (!open) {
          setZoom(MIN_ZOOM);
          onClose();
        }
      }}
    >
      {item && (
        <DialogContent
          showCloseButton={false}
          onKeyDown={onKeyDown}
          className="flex h-[95svh] max-w-[95vw] flex-col gap-3 p-3 sm:max-w-[95vw]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <DialogTitle className="truncate">{item.title}</DialogTitle>
              <DialogDescription>
                <span data-testid="lightbox-position">
                  {t('guides.position', {
                    n: index! + 1,
                    total: items.length,
                  })}
                </span>
                {item.description && ` · ${item.description}`}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('guides.zoom_out')}
                disabled={zoom <= MIN_ZOOM}
                onClick={() => zoomBy(-STEP)}
              >
                <ZoomOut />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('guides.zoom_in')}
                disabled={zoom >= MAX_ZOOM}
                onClick={() => zoomBy(STEP)}
              >
                <ZoomIn />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('guides.zoom_reset')}
                disabled={zoom === MIN_ZOOM}
                onClick={() => setZoom(MIN_ZOOM)}
              >
                <RotateCcw />
              </Button>
              {downloadable && (
                <Button asChild variant="ghost" size="icon">
                  <a
                    href={`${item.image}-full.webp`}
                    download
                    aria-label={t('guides.download')}
                  >
                    <Download />
                  </a>
                </Button>
              )}
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('guides.close')}
                >
                  <X />
                </Button>
              </DialogClose>
            </div>
          </div>

          <div
            className="min-h-0 flex-1 overflow-auto rounded-md bg-muted"
            onDoubleClick={() => setZoom(z => (z === MIN_ZOOM ? 2 : MIN_ZOOM))}
          >
            <Picture
              image={item.image}
              alt={item.title}
              sizes="95vw"
              eager
              className="mx-auto max-w-none object-contain"
              style={{ width: `${zoom * 100}%` }}
            />
          </div>

          {items.length > 1 && (
            <div className="flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={() => go(-1)}>
                {rtl ? <ChevronRight /> : <ChevronLeft />}
                {t('guides.previous')}
              </Button>
              <Button type="button" variant="outline" onClick={() => go(1)}>
                {t('guides.next')}
                {rtl ? <ChevronLeft /> : <ChevronRight />}
              </Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
