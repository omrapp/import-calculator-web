import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useState } from 'react';
import { useLocation, useOutlet } from 'react-router';

import { duration, ease } from '@/lib/motion';

/** Keeps the leaving page's element while it fades out. */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

/**
 * Cross-fades pages on pathname change. `mode="wait"` means the old page is
 * gone before the new one mounts, so there is never more than one `h1`.
 */
export function PageTransition() {
  const { pathname } = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo({ top: 0 })}
    >
      <m.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: duration.normal, ease: ease.outQuart },
        }}
        exit={{
          opacity: 0,
          transition: { duration: duration.fast * 0.8, ease: ease.inQuart },
        }}
      >
        <FrozenOutlet />
      </m.div>
    </AnimatePresence>
  );
}
