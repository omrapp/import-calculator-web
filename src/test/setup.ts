import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { afterEach, vi } from 'vitest';

import { initI18n } from '@/features/i18n';

// Animations finish instantly so tests see final states and values.
MotionGlobalConfig.skipAnimations = true;

// Node-environment tests (e.g. PDF rendering) have no document.
if (typeof document !== 'undefined') {
  void initI18n('en');

  // jsdom lacks these browser APIs; Motion and the theme use them.
  window.matchMedia ??= query =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;

  // Everything is "in view" at once, so whileInView reveals run immediately.
  window.IntersectionObserver ??= class {
    readonly root = null;
    readonly rootMargin = '';
    readonly scrollMargin = '';
    readonly thresholds = [];
    private callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe(target: Element) {
      this.callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        this,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };

  window.scrollTo = vi.fn() as typeof window.scrollTo;
}

afterEach(() => {
  cleanup();
});
