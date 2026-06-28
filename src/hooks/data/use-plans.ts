/**
 * Keşfet (Explore) plan kartları hook'u — şimdilik mock.
 * TODO(api): useTrips() çıktısından map et veya GET /plans.
 */

import type { PlanCardVM } from '@/mocks/plans';
import { MOCK_PLANS } from '@/mocks/plans';
import { AsyncState, loaded } from './async-state';

export function usePlans(): AsyncState<PlanCardVM[]> {
  return loaded(MOCK_PLANS);
}
