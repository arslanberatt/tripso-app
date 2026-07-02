/**
 * Trips listesi hook'u (Trips sekmesi).
 *
 * TODO(api): GET /trips çağrısıyla değiştir. Örn:
 *   return useQuery({ queryKey: ['trips', status], queryFn: () => api.listTrips({ status }) });
 */

import type { Trip, TripStatus } from '@/types';
import { getAllTrips } from '@/mocks/trip-draft-store';
import { AsyncState, loaded } from './async-state';

export function useTrips(status?: TripStatus): AsyncState<Trip[]> {
  const all = getAllTrips();
  const list = status ? all.filter((t) => t.status === status) : all;
  return loaded(list);
}
