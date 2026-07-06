import type { IconName } from '@/components/ui/icon';
import type { BudgetCategoryKey } from '@/types';

export const BUDGET_CATEGORIES: BudgetCategoryKey[] = [
  'accommodation',
  'food',
  'activities',
  'transport',
  'shopping',
  'other',
];

export const BUDGET_CATEGORY_ICON: Record<BudgetCategoryKey, IconName> = {
  accommodation: 'bed-outline',
  food: 'restaurant-outline',
  activities: 'trail-sign-outline',
  transport: 'car-outline',
  shopping: 'bag-outline',
  other: 'ellipse-outline',
};
