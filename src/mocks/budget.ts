/** Sahte harcama verisi (Bütçe Takibi). `planId` = Trip.id. */

import { MOCK_TRIPS } from './trips';

import type { Expense } from '@/types';

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'ex-1',
    planId: MOCK_TRIPS[0].id,
    category: 'accommodation',
    label: 'Villa — 4 gece',
    amount: 980,
    currency: 'USD',
    date: '2026-07-12',
  },
  {
    id: 'ex-2',
    planId: MOCK_TRIPS[0].id,
    category: 'food',
    label: 'Warung akşam yemeği',
    amount: 42,
    currency: 'USD',
    date: '2026-07-13',
  },
  {
    id: 'ex-3',
    planId: MOCK_TRIPS[0].id,
    category: 'activities',
    label: 'Tegallalang giriş + rehber',
    amount: 65,
    currency: 'USD',
    date: '2026-07-14',
  },
  {
    id: 'ex-4',
    planId: MOCK_TRIPS[0].id,
    category: 'transport',
    label: 'Scooter kiralama (3 gün)',
    amount: 30,
    currency: 'USD',
    date: '2026-07-12',
  },
  {
    id: 'ex-5',
    planId: MOCK_TRIPS[1].id,
    category: 'accommodation',
    label: 'Ryokan — 6 gece',
    amount: 1200,
    currency: 'USD',
    date: '2026-04-02',
  },
  {
    id: 'ex-6',
    planId: MOCK_TRIPS[1].id,
    category: 'food',
    label: 'Nişin Yokocho ramen turu',
    amount: 38,
    currency: 'USD',
    date: '2026-04-03',
  },
];

/** Bütçe kategori dağılımı için sabit oranlar (yeni/mock planlar için tahmini kırılım). */
export const BUDGET_CATEGORY_SPLIT: Record<Expense['category'], number> = {
  accommodation: 0.4,
  food: 0.2,
  activities: 0.2,
  transport: 0.12,
  shopping: 0.05,
  other: 0.03,
};

export function getExpensesForPlan(planId: string): Expense[] {
  return MOCK_EXPENSES.filter((e) => e.planId === planId);
}
