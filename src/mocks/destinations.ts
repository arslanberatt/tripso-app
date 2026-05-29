/**
 * Sahte destinasyon verisi (UI geliştirme için). API'ye bağlanınca bu dosya
 * silinecek; ekranlar `use-destinations` / `use-destination` hook'larından beslenir.
 * Görseller Unsplash CDN (cached-image ile yüklenir).
 *
 * KURAL: id = UUID string, tarih alanı yok (bunlar view-model).
 */

import type { Destination, Experience } from '@/types';
import type { IconName } from '@/components/ui/icon';

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: '7c9e6f2a-1b3d-4e5f-8a90-1c2d3e4f5a6b',
    name: 'Bali',
    region: 'Indonesia',
    countryCode: 'ID',
    cityName: 'Denpasar',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80',
    ],
    rating: 4.7,
    reviewCount: 1250,
    description:
      'Lush rice terraces, volcanic mountains and spiritual temples make Bali a perfect mix of adventure and relaxation.',
    tags: ['Nature', 'Beach', 'Culture', 'Adventure'],
    highlights: [
      { icon: 'leaf-outline', label: 'Rice Terraces' },
      { icon: 'sunny-outline', label: 'Beaches' },
      { icon: 'business-outline', label: 'Temples' },
      { icon: 'restaurant-outline', label: 'Local Food' },
    ],
  },
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Santorini',
    region: 'Greece',
    countryCode: 'GR',
    cityName: 'Thira',
    category: 'landmark',
    imageUrl:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
    ],
    rating: 4.8,
    reviewCount: 980,
    description:
      'Whitewashed villages perched on dramatic cliffs above a deep-blue caldera — the most iconic sunset in the Aegean.',
    tags: ['Romantic', 'Beach', 'Relaxing', 'Views'],
    highlights: [
      { icon: 'partly-sunny-outline', label: 'Sunsets' },
      { icon: 'wine-outline', label: 'Wineries' },
      { icon: 'water-outline', label: 'Caldera' },
      { icon: 'camera-outline', label: 'Photo Spots' },
    ],
  },
  {
    id: 'f0e1d2c3-b4a5-4968-8776-5d4c3b2a1f0e',
    name: 'Kyoto',
    region: 'Japan',
    countryCode: 'JP',
    cityName: 'Kyoto',
    category: 'attraction',
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80',
    ],
    rating: 4.6,
    reviewCount: 870,
    description:
      'Ancient temples, bamboo groves and timeless tea houses — Kyoto is the cultural heart of Japan.',
    tags: ['Culture', 'History', 'City', 'Food'],
    highlights: [
      { icon: 'business-outline', label: 'Temples' },
      { icon: 'leaf-outline', label: 'Bamboo Grove' },
      { icon: 'cafe-outline', label: 'Tea Houses' },
      { icon: 'train-outline', label: 'Easy Transit' },
    ],
  },
  {
    id: '3b2a1f0e-d4c3-4b2a-9f0e-1d2c3b4a5f6e',
    name: 'Maldives',
    region: 'South Asia',
    countryCode: 'MV',
    cityName: 'Malé',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80',
    ],
    rating: 4.8,
    reviewCount: 1245,
    description:
      'Experience paradise with crystal-clear waters, white sandy beaches, and luxurious overwater bungalows.',
    tags: ['Beach', 'Relaxing', 'Family', 'Water Sports'],
    highlights: [
      { icon: 'wifi-outline', label: 'Free Wi-Fi' },
      { icon: 'cafe-outline', label: 'Breakfast' },
      { icon: 'water-outline', label: 'Pool' },
      { icon: 'sparkles-outline', label: 'Spa' },
    ],
  },
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f',
    title: 'Island Hopping',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=900&q=80',
    durationLabel: '1 day',
  },
  {
    id: 'd2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f60',
    title: 'Old Town Food Walk',
    category: 'restaurant',
    imageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    durationLabel: '3 hours',
  },
  {
    id: 'e3f4a5b6-c7d8-4e9f-0a1b-2c3d4e5f6071',
    title: 'Sunset Sailing',
    category: 'entertainment',
    imageUrl:
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=900&q=80',
    durationLabel: '2 hours',
  },
];

/** Home ekranındaki kategori filtreleri (ikon = Ionicons adı). */
export const CATEGORY_FILTERS: { key: string; label: string; icon: IconName }[] = [
  { key: 'all', label: 'All', icon: 'grid-outline' },
  { key: 'adventure', label: 'Adventure', icon: 'trail-sign-outline' },
  { key: 'beach', label: 'Beach', icon: 'umbrella-outline' },
  { key: 'city', label: 'City', icon: 'business-outline' },
  { key: 'food', label: 'Food', icon: 'restaurant-outline' },
];
