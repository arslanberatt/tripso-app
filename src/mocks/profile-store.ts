/**
 * Kişiselleştirme sihirbazının yazdığı profil alanlarını bellekte tutan sahte
 * "yazma" katmanı (trip-draft-store ile aynı yaklaşım). Gerçek backend'e
 * bağlanınca PATCH /users/me/profile mutation'ı bunun yerini alır. Uygulama
 * yeniden başlayınca MOCK_PROFILE varsayılanlarına döner (görünen ad hariç —
 * o `usePreferences.setDisplayName` ile kalıcı yazılır).
 */

import { MOCK_PROFILE } from './user';

import type { UserProfile } from '@/types';

let overrides: Partial<UserProfile> = {};

export function getProfile(): UserProfile {
  return { ...MOCK_PROFILE, ...overrides };
}

export function updateProfile(patch: Partial<UserProfile>): UserProfile {
  overrides = { ...overrides, ...patch, updatedAt: new Date().toISOString() };
  return getProfile();
}
