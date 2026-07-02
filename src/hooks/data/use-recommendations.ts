/**
 * "Başkaları Ne Önerdi" hook'u — şimdilik mock.
 * TODO(api): GET /cities/:city/recommendations ile değiştir.
 */

import { getRecommendationCities, getRecommendationsForCity } from '@/mocks/recommendations';
import type { CommunityRecommendation } from '@/types';
import { AsyncState, loaded } from './async-state';

export function useRecommendations(city: string | undefined): AsyncState<CommunityRecommendation[]> {
  return loaded(city ? getRecommendationsForCity(city) : []);
}

export function useRecommendationCities(): AsyncState<string[]> {
  return loaded(getRecommendationCities());
}
