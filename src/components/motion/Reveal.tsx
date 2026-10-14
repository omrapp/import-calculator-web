import * as m from 'motion/react-m';
import type { ComponentProps } from 'react';

import { fadeUp, staggerChildren } from '@/lib/motion';

type DivProps = ComponentProps<typeof m.div>;

/** A list whose `RevealItem` children fade up in sequence when it scrolls into view. */
export function RevealGroup(props: DivProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerChildren}
      {...props}
    />
  );
}

export function RevealItem(props: DivProps) {
  return <m.div variants={fadeUp} {...props} />;
}

/** A single block that fades up when it scrolls into view. */
export function Reveal(props: DivProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUp}
      {...props}
    />
  );
}
