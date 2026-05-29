/**
 * Trips listesi hook'u (Trips sekmesi — şimdilik stub ekran).
 *
 * TODO(api): GET /trips çağrısıyla değiştir. Örn:
 *   return useQuery({ queryKey: ['trips', status], queryFn: () => api.listTrips({ status }) });
 */

import type { Trip, TripStatus } from '@/types';
import { MOCK_TRIPS } from '@/mocks/trips';
import { AsyncState, loaded } from './async-state';

export function useTrips(status?: TripStatus): AsyncState<Trip[]> {
  const list = status ? MOCK_TRIPS.filter((t) => t.status === status) : MOCK_TRIPS;
  return loaded(list);
}
