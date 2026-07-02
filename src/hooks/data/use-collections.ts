/**
 * Kaydedilenler / Koleksiyonlar hook'u — şimdilik mock.
 * TODO(api): GET /collections ile değiştir.
 */

import { MOCK_COLLECTIONS } from '@/mocks/collections';
import type { SavedCollection } from '@/types';
import { AsyncState, loaded } from './async-state';

export function useCollections(): AsyncState<SavedCollection[]> {
  return loaded(MOCK_COLLECTIONS);
}
