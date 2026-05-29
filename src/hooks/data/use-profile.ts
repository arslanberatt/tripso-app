/**
 * Profil + tercihler hook'u (Profile sekmesi — şimdilik stub ekran).
 *
 * TODO(api): GET /users/me/profile ile değiştir; güncelleme için PATCH /users/me/profile
 * yapan bir `updateProfile` mutation'ı ekle (useMutation / Zustand action).
 */

import type { User, UserProfile } from '@/types';
import { MOCK_PROFILE, MOCK_USER } from '@/mocks/user';
import { AsyncState, loaded } from './async-state';

export function useProfile(): AsyncState<{ user: User; profile: UserProfile }> {
  return loaded({ user: MOCK_USER, profile: MOCK_PROFILE });
}
