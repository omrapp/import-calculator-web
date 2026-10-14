import { animate, MotionGlobalConfig, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { duration, ease } from '@/lib/motion';

type Props = {
  value: number;
  format: (value: number) => string;
  /** Count up from zero on mount (the result reveal); otherwise only tween changes. */
  countUp?: boolean;
  className?: string;
};

/**
 * Tweens between values; the DOM text always settles on `format(value)`.
 * Shows the final value straight away under reduced motion.
 */
export function AnimatedNumber({ value, format, countUp, className }: Props) {
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion) || MotionGlobalConfig.skipAnimations;
  const [shown, setShown] = useState(countUp && !still ? 0 : value);
  const current = useRef(shown);

  useEffect(() => {
    if (still || current.current === value) {
      current.current = value;
      setShown(value);
      return;
    }
    const controls = animate(current.current, value, {
      duration: countUp ? duration.count : duration.slow,
      ease: ease.outExpo,
      onUpdate: latest => {
        current.current = latest;
        setShown(latest);
      },
      onComplete: () => setShown(value),
    });
    return () => controls.stop();
  }, [value, still, countUp]);

  return <span className={className}>{format(shown)}</span>;
}
