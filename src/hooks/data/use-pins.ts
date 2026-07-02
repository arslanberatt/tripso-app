/**
 * Gezi pinleri hook'u (Harita, Topluluk Haritası, Gezi Günlüğü — şimdilik mock).
 * TODO(api): GET /pins?scope=... ile değiştir.
 */

import { MOCK_PINS } from '@/mocks/pins';
import { MOCK_USER } from '@/mocks/user';
import type { TravelPin } from '@/types';
import { AsyncState, loaded } from './async-state';

export type PinScope = 'mine' | 'friends' | 'everyone';

export function usePins(scope: PinScope = 'everyone'): AsyncState<TravelPin[]> {
  if (scope === 'mine') return loaded(MOCK_PINS.filter((p) => p.userId === MOCK_USER.id));
  if (scope === 'friends') return loaded(MOCK_PINS.filter((p) => p.userId !== MOCK_USER.id));
  return loaded(MOCK_PINS);
}
