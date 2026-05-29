/**
 * Oturum açmış kullanıcı hook'u (HomeHeader'daki avatar + selamlama için).
 * TODO(api): auth store'dan / GET /users/me ile değiştir.
 */

import type { User } from '@/types';
import { MOCK_USER } from '@/mocks/user';
import { AsyncState, loaded } from './async-state';

export function useCurrentUser(): AsyncState<User> {
  return loaded(MOCK_USER);
}
