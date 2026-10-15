import { cn } from '@/lib/utils';

import data from './photos.json';

export type PhotoName = keyof typeof data.sizes;

const srcSet = (name: PhotoName, format: 'avif' | 'webp') =>
  `/photos/${name}-800.${format} 800w, /photos/${name}-1600.${format} 1600w`;

/**
 * Responsive AVIF/WebP shipping photo from /public/photos
 * (made by scripts/fetch-photos.ts). Decorative by default: pass `alt`
 * only when the photo adds meaning the text around it doesn't.
 */
export function Photo({
  name,
  alt = '',
  sizes = '100vw',
  eager = false,
  className,
}: {
  name: PhotoName;
  alt?: string;
  sizes?: string;
  /** Above-the-fold heroes load eagerly with high priority. */
  eager?: boolean;
  className?: string;
}) {
  const [width, height] = data.sizes[name];
  return (
    <picture className={cn('block overflow-hidden', className)}>
      <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, 'webp')} sizes={sizes} />
      <img
        src={`/photos/${name}-1600.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        className="size-full object-cover"
      />
    </picture>
  );
}
