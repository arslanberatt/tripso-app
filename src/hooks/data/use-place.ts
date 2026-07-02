/**
 * Mekân Detayı hook'u — şimdilik mock.
 * TODO(api): Place tablosu + Google Places (New) canlı çağrısıyla değiştir
 * (yorumlar TOS gereği cache'lenmez — bkz. docs/product-plan.md §5.2).
 */

import { getPlaceById, getReviewsForPlace, type PlaceDetailVM } from '@/mocks/places';
import type { PlaceReview } from '@/types';
import { AsyncState, loaded } from './async-state';

export function usePlace(id: string | undefined): AsyncState<PlaceDetailVM | null> {
  return loaded(id ? getPlaceById(id) : null);
}

export function usePlaceReviews(id: string | undefined): AsyncState<PlaceReview[]> {
  return loaded(id ? getReviewsForPlace(id) : []);
}
