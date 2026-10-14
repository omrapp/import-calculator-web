import { useSyncExternalStore } from 'react';

import { getTheme, resolveTheme, setTheme, subscribe } from './theme';

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme);
  return { theme, resolved: resolveTheme(theme), setTheme };
}
