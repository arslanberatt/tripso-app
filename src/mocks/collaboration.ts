/** Sahte ortak plan verisi (Ortak Plan / Davet). `planId` = `PlanDetailVM.id`. */

import { MOCK_FRIENDS } from './friends';
import { MOCK_USER } from './user';

import type { PlanCollaborator, PlanComment, PlanVote } from '@/types';

export const MOCK_COLLABORATORS: Record<string, PlanCollaborator[]> = {
  'plan-2': [
    { id: MOCK_USER.id, name: MOCK_USER.name, avatarUrl: MOCK_USER.avatarUrl, role: 'owner' },
    { id: MOCK_FRIENDS[0].id, name: MOCK_FRIENDS[0].name, avatarUrl: MOCK_FRIENDS[0].avatarUrl, role: 'editor' },
    { id: MOCK_FRIENDS[1].id, name: MOCK_FRIENDS[1].name, avatarUrl: MOCK_FRIENDS[1].avatarUrl, role: 'editor' },
  ],
};

export const MOCK_VOTES: Record<string, PlanVote[]> = {
  'plan-2': [
    { itemId: 'plan-2-d1-i1', upvotes: 3, downvotes: 0, myVote: 'up' },
    { itemId: 'plan-2-d2-i1', upvotes: 1, downvotes: 2, myVote: 'down' },
    { itemId: 'plan-2-d2-i2', upvotes: 2, downvotes: 0, myVote: null },
  ],
};

export const MOCK_COMMENTS: Record<string, PlanComment[]> = {
  'plan-2': [
    {
      id: 'cm-1',
      itemId: 'plan-2-d2-i1',
      authorName: MOCK_FRIENDS[0].name,
      authorAvatarUrl: MOCK_FRIENDS[0].avatarUrl,
      text: 'Sörf dersini sabah erken alalım, öğleden sonra rüzgar çok oluyor.',
      createdAt: '2026-06-02T09:00:00.000Z',
    },
    {
      id: 'cm-2',
      itemId: null,
      authorName: MOCK_FRIENDS[1].name,
      authorAvatarUrl: MOCK_FRIENDS[1].avatarUrl,
      text: 'Bütçeye scooter kirası eklemeyi unutmayalım.',
      createdAt: '2026-06-02T10:30:00.000Z',
    },
  ],
};

export function getCollaborators(planId: string): PlanCollaborator[] {
  return (
    MOCK_COLLABORATORS[planId] ?? [
      { id: MOCK_USER.id, name: MOCK_USER.name, avatarUrl: MOCK_USER.avatarUrl, role: 'owner' },
    ]
  );
}

export function getVotes(planId: string): PlanVote[] {
  return MOCK_VOTES[planId] ?? [];
}

export function getComments(planId: string): PlanComment[] {
  return MOCK_COMMENTS[planId] ?? [];
}
