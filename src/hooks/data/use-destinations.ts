/**
 * Destinasyon listesi hook'u — şimdilik mock döner.
 *
 * TODO(api): mock'u gerçek veriyle değiştir. Örn:
 *   return useQuery({ queryKey: ['destinations', category], queryFn: () => api.getDestinations(category) });
 * veya Zustand:
 *   return useDestinationsStore((s) => s.list);
 * Dönüş tipi (AsyncState<Destination[]>) aynı kaldığı için ekranlar değişmez.
 */

import type { Destination } from '@/types';
import { MOCK_DESTINATIONS } from '@/mocks/destinations';
import { AsyncState, loaded } from './async-state';

export function useDestinations(category: string = 'all'): AsyncState<Destination[]> {
  // TODO(api): kategori filtrelemesi backend query param'ı olacak.
  const list =
    category === 'all'
      ? MOCK_DESTINATIONS
      : MOCK_DESTINATIONS.filter((d) =>
          d.tags.some((t) => t.toLowerCase() === category.toLowerCase()),
        );

  return loaded(list);
}
