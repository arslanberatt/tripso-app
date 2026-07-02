/**
 * Sosyal katman tipleri: gezi pinleri, arkadaşlar, topluluk önerileri, rozetler.
 * Backend'de henüz karşılığı yok — bu tipler frontend view-model'idir.
 */

import type { ISODateTime, UUID } from './common';
import type { PlaceCategory } from './place';

/** Kullanıcının haritaya pinlediği gezilmiş bir yer (Gezi Günlüğü + Topluluk Haritası). */
export interface TravelPin {
  id: UUID;
  userId: UUID;
  userName: string;
  userAvatarUrl: string | null;
  placeId: UUID;
  placeName: string;
  city: string;
  countryCode: string;
  coordinates: { lat: number; lng: number };
  category: PlaceCategory;
  photoUrl: string;
  caption: string | null;
  likeCount: number;
  likedByMe: boolean;
  createdAt: ISODateTime;
}

/** Arkadaş listesi / topluluk profili özeti. */
export interface FriendSummary {
  id: UUID;
  name: string;
  avatarUrl: string | null;
  homeCity: string;
  countriesVisited: number;
  citiesVisited: number;
  mutualFriends: number;
  isFollowing: boolean;
}

/** Şehir bazlı topluluk önerisi ("Başkaları Ne Önerdi"). */
export interface CommunityRecommendation {
  id: UUID;
  placeId: UUID;
  placeName: string;
  city: string;
  countryCode: string;
  category: PlaceCategory;
  imageUrl: string;
  tripsoRating: number;
  tripsoReviewCount: number;
  googleRating: number;
  googleReviewCount: number;
  likeCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
}
