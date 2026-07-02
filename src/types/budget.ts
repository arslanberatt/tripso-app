/** Plan bütçe takibi — plan bütçesi vs gerçekleşen harcama. */

import type { ISODate, UUID } from './common';

export type BudgetCategoryKey =
  | 'accommodation'
  | 'food'
  | 'activities'
  | 'transport'
  | 'shopping'
  | 'other';

export interface Expense {
  id: UUID;
  planId: UUID;
  category: BudgetCategoryKey;
  label: string;
  amount: number;
  currency: string;
  date: ISODate;
}
