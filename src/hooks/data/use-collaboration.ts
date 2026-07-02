/**
 * Ortak Plan / Davet hook'u — şimdilik mock.
 * TODO(api): GET /trips/:id/collaborators + /votes + /comments ile değiştir.
 */

import { getCollaborators, getComments, getVotes } from '@/mocks/collaboration';
import type { PlanCollaborator, PlanComment, PlanVote } from '@/types';
import { AsyncState, loaded } from './async-state';

export function useCollaboration(
  planId: string | undefined,
): AsyncState<{ collaborators: PlanCollaborator[]; votes: PlanVote[]; comments: PlanComment[] }> {
  if (!planId) return loaded({ collaborators: [], votes: [], comments: [] });
  return loaded({
    collaborators: getCollaborators(planId),
    votes: getVotes(planId),
    comments: getComments(planId),
  });
}
