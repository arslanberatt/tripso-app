/**
 * Sahte kullanıcı + profil verisi. API'ye bağlanınca silinecek.
 * KURAL: id = UUID, tarihler = ISO 8601 string.
 */

import type { User, UserProfile } from '@/types';

export const MOCK_USER: User = {
  id: '11111111-2222-4333-8444-555566667777',
  email: 'david@tripso.app',
  name: 'David',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  timezone: 'Europe/Istanbul',
  locale: 'en-US',
  homeCity: 'Istanbul',
  homeAirportCode: 'IST',
  googleId: null,
  appleId: null,
  emailVerifiedAt: '2026-01-10T08:00:00.000Z',
  lastActiveAt: '2026-05-29T07:30:00.000Z',
  createdAt: '2026-01-10T08:00:00.000Z',
  updatedAt: '2026-05-29T07:30:00.000Z',
  deletedAt: null,
};

export const MOCK_PROFILE: UserProfile = {
  id: '88889999-aaaa-4bbb-8ccc-ddddeeeefff0',
  userId: MOCK_USER.id,
  dietary: ['vegetarian'],
  alcohol: 'occasional',
  accommodationTier: 'comfort',
  pace: 'balanced',
  transportationStyle: 'public',
  physicalCapability: 'high',
  interests: ['food', 'history', 'nature', 'photography'],
  languages: ['en', 'tr'],
  ageGroup: 'adult',
  travelExperience: 'intermediate',
  createdAt: '2026-01-10T08:00:00.000Z',
  updatedAt: '2026-05-20T12:00:00.000Z',
  deletedAt: null,
};
