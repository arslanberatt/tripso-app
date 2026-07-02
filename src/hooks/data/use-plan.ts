/**
 * Plan / Rota Detayı hook'u — şimdilik mock.
 * TODO(api): GET /trips/:id/active-plan-version ile değiştir.
 */

import { getPlanDetail, type PlanDetailVM } from '@/mocks/plan-details';
import { AsyncState, loaded } from './async-state';

export function usePlan(id: string | undefined): AsyncState<PlanDetailVM | null> {
  return loaded(getPlanDetail(id));
}
