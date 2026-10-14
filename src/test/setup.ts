import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { initI18n } from '@/features/i18n';

void initI18n('en');

afterEach(() => {
  cleanup();
});
