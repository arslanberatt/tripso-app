/**
 * Tek destinasyon hook'u (Destination Detail ekranı).
 *
 * TODO(api): mock'u değiştir. Örn:
 *   return useQuery({ queryKey: ['destination', id], queryFn: () => api.getDestination(id) });
 */

import type { Destination } from '@/types';
import { MOCK_DESTINATIONS } from '@/mocks/destinations';
import { AsyncState, loaded } from './async-state';

export function useDestination(id: string | undefined): AsyncState<Destination | null> {
  const found = MOCK_DESTINATIONS.find((d) => d.id === id) ?? null;
  return loaded(found);
}
