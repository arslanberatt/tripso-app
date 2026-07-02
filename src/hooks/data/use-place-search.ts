/**
 * Trip Sihirbazı destinasyon adımı için "geocoding" arama hook'u — şimdilik mock.
 * TODO(api): Mapbox Geocoding/Search Box API ile değiştir (bkz. product-plan.md §5.1).
 */

import { searchPlaces, type PlaceSearchResultVM } from '@/mocks/place-search';
import { AsyncState, loaded } from './async-state';

export function usePlaceSearch(query: string): AsyncState<PlaceSearchResultVM[]> {
  return loaded(searchPlaces(query));
}
