/**
 * Sahte arkadaş verisi (Arkadaşlar & Sosyal Profil, Topluluk Haritası). API'ye
 * bağlanınca silinecek. KURAL: id = UUID.
 */

import type { FriendSummary } from '@/types';

export const MOCK_FRIENDS: FriendSummary[] = [
  {
    id: 'f1a1a1a1-1111-4a1a-8a1a-1a1a1a1a1a11',
    name: 'Ayşe Yılmaz',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    homeCity: 'Istanbul',
    countriesVisited: 12,
    citiesVisited: 34,
    mutualFriends: 4,
    isFollowing: true,
  },
  {
    id: 'f2b2b2b2-2222-4b2b-8b2b-2b2b2b2b2b22',
    name: 'Mert Kaya',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    homeCity: 'Izmir',
    countriesVisited: 7,
    citiesVisited: 19,
    mutualFriends: 2,
    isFollowing: true,
  },
  {
    id: 'f3c3c3c3-3333-4c3c-8c3c-3c3c3c3c3c33',
    name: 'Elif Demir',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    homeCity: 'Ankara',
    countriesVisited: 20,
    citiesVisited: 55,
    mutualFriends: 8,
    isFollowing: false,
  },
  {
    id: 'f4d4d4d4-4444-4d4d-8d4d-4d4d4d4d4d44',
    name: 'Can Öztürk',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    homeCity: 'Bursa',
    countriesVisited: 5,
    citiesVisited: 11,
    mutualFriends: 1,
    isFollowing: false,
  },
  {
    id: 'f5e5e5e5-5555-4e5e-8e5e-5e5e5e5e5e55',
    name: 'Zeynep Arslan',
    avatarUrl: 'https://i.pravatar.cc/150?img=45',
    homeCity: 'Antalya',
    countriesVisited: 15,
    citiesVisited: 41,
    mutualFriends: 6,
    isFollowing: true,
  },
  {
    id: 'f6f6f6f6-6666-4f6f-8f6f-6f6f6f6f6f66',
    name: 'Emre Şahin',
    avatarUrl: 'https://i.pravatar.cc/150?img=52',
    homeCity: 'Eskişehir',
    countriesVisited: 3,
    citiesVisited: 8,
    mutualFriends: 0,
    isFollowing: false,
  },
];
