import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { initI18n } from '@/features/i18n';

// Node-environment tests (e.g. PDF rendering) have no document.
if (typeof document !== 'undefined') void initI18n('en');

afterEach(() => {
  cleanup();
});
