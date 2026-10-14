import { cn } from '@/lib/utils';

import sizes from './data/image-sizes.json';
import type { ImagePath } from './data/types';

const intrinsic: Record<string, number[]> = sizes;

const srcSet = (image: ImagePath, format: 'avif' | 'webp') =>
  `${image}-640.${format} 640w, ${image}-1600.${format} 1600w`;

/** Responsive AVIF/WebP image from /public/guides. */
export function Picture({
  image,
  alt,
  sizes: sizesAttr = '(min-width: 768px) 50vw, 100vw',
  className,
  style,
  eager = false,
}: {
  image: ImagePath;
  alt: string;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
}) {
  const [width, height] = intrinsic[image.split('/').at(-1)!] ?? [1600, 900];
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={srcSet(image, 'avif')}
        sizes={sizesAttr}
      />
      <source
        type="image/webp"
        srcSet={srcSet(image, 'webp')}
        sizes={sizesAttr}
      />
      <img
        src={`${image}-1600.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('h-auto w-full', className)}
        style={style}
      />
    </picture>
  );
}
