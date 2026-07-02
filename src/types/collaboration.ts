/** Ortak Plan / Davet — grup seyahatlerinde birlikte planlama. */

import type { ISODateTime, UUID } from './common';

export interface PlanCollaborator {
  id: UUID;
  name: string;
  avatarUrl: string | null;
  role: 'owner' | 'editor';
}

export type VoteValue = 'up' | 'down' | null;

export interface PlanVote {
  itemId: UUID;
  upvotes: number;
  downvotes: number;
  myVote: VoteValue;
}

export interface PlanComment {
  id: UUID;
  itemId: UUID | null;
  authorName: string;
  authorAvatarUrl: string | null;
  text: string;
  createdAt: ISODateTime;
}
