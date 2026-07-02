/** Mekân yorumu — Tripso topluluğundan ya da Google'dan (bkz. product-plan.md §5.2). */

import type { ISODateTime, UUID } from './common';

export type ReviewSource = 'tripso' | 'google';

export interface PlaceReview {
  id: UUID;
  authorName: string;
  authorAvatarUrl: string | null;
  rating: number;
  comment: string;
  createdAt: ISODateTime;
  source: ReviewSource;
}
