import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

const loadFeatures = () => import('./features').then(m => m.default);

/** `m.*` components only (strict), shared reduced-motion policy. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
