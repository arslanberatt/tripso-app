/**
 * Bütçe Takibi hook'u — şimdilik mock.
 * TODO(api): GET /trips/:id/expenses ile değiştir.
 */

import { getExpensesForPlan } from '@/mocks/budget';
import type { Expense } from '@/types';
import { AsyncState, loaded } from './async-state';

export function useBudget(planId: string | undefined): AsyncState<Expense[]> {
  return loaded(planId ? getExpensesForPlan(planId) : []);
}
