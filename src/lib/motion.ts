import type { Transition, Variants } from 'motion/react';

/** Seconds; mirrors `--duration-*` in index.css. */
export const duration = {
  instant: 0.08,
  fast: 0.15,
  normal: 0.22,
  slow: 0.4,
  count: 0.8,
} as const;

/** Mirrors the `--ease-*` tokens in index.css. */
export const ease = {
  outQuart: [0.25, 1, 0.5, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inQuart: [0.5, 0, 0.75, 0],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export const spring = {
  /** Active nav pill, mode switcher thumb, tab indicator. */
  indicator: { type: 'spring', stiffness: 500, damping: 40 },
  /** Lists reflowing after an item leaves. */
  layout: { type: 'spring', stiffness: 300, damping: 30 },
} as const satisfies Record<string, Transition>;

/** Gap between siblings in a list entrance; capped by `staggerFor`. */
export const STAGGER = 0.04;
const MAX_STAGGERED = 8;

export const staggerFor = (index: number) =>
  Math.min(index, MAX_STAGGERED) * STAGGER;

/** Fade and rise 8px; exits are faster than entrances. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: ease.outQuart },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: ease.inQuart },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};
