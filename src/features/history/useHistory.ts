import { useSyncExternalStore } from 'react';

import { listSaved, type SavedCalculation, subscribe } from './storage';

/** The History, kept in sync with localStorage in this and other tabs. */
export function useHistory(): SavedCalculation[] {
  return useSyncExternalStore(subscribe, listSaved);
}
