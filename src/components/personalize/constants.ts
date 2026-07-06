import type { AccommodationTier, Alcohol, Pace } from '@/types';

export const AGE_GROUPS = ['18_24', '25_34', '35_44', '45_54', '55_plus'] as const;
export const ALCOHOL_OPTIONS: Alcohol[] = ['yes', 'occasional', 'no'];
export const DIETARY_OPTIONS = ['none', 'vegetarian', 'vegan', 'halal', 'gluten_free'] as const;
export const PACE_OPTIONS: Pace[] = ['relaxed', 'balanced', 'intense'];
export const ACCOMMODATION_TIERS: AccommodationTier[] = ['economy', 'standard', 'comfort', 'luxury'];
export const STEP_COUNT = 5;
