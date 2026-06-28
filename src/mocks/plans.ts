/**
 * Keşfet (Explore) plan kartı view-model'i + sahte veri.
 *
 * Backend `Trip` modeline DOKUNMAZ — bu kart-hazır bir view-model. API'ye
 * bağlanınca `usePlans()` içinde Trip → PlanCardVM map edilecek. `budgetAmount`
 * şimdilik "ortalama (avg)" değeri olarak gösterilir. Başlık + etiket label'ları
 * burada tutulur (i18n değil; `destinations.ts` ile aynı yaklaşım).
 */

import type { IconName } from '@/components/ui/icon';

export interface PlanCardVM {
  id: string;
  /** Gösterim başlığı (gün sayısı dahil). */
  title: string;
  /** "avg" değeri (Trip.budgetAmount). */
  budgetAmount: number;
  /** ISO 3 harf (Trip.budgetCurrency). */
  budgetCurrency: string;
  placesCount: number;
  /** 1-2 etiket. */
  tags: { label: string; icon?: IconName }[];
  imageUrl: string;
  status: 'active' | 'completed' | 'planning' | 'draft';
}

export const MOCK_PLANS: PlanCardVM[] = [
  {
    id: 'plan-1',
    title: 'Tokyo şehrinde 5 günlük keşif',
    budgetAmount: 1000,
    budgetCurrency: 'USD',
    placesCount: 5,
    tags: [
      { label: 'Mimari', icon: 'business-outline' },
      { label: 'Doğa', icon: 'leaf-outline' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
    status: 'active',
  },
  {
    id: 'plan-2',
    title: "Bali'de 7 günlük yeni macera",
    budgetAmount: 1800,
    budgetCurrency: 'USD',
    placesCount: 8,
    tags: [
      { label: 'Doğa', icon: 'leaf-outline' },
      { label: 'Plaj', icon: 'umbrella-outline' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
    status: 'planning',
  },
  {
    id: 'plan-3',
    title: "Avustralya'yı ilk kez keşfet",
    budgetAmount: 2500,
    budgetCurrency: 'USD',
    placesCount: 12,
    tags: [
      { label: 'Macera', icon: 'trail-sign-outline' },
      { label: 'Şehir', icon: 'business-outline' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&q=80',
    status: 'active',
  },
  {
    id: 'plan-4',
    title: "Kyoto'da 6 günlük kültür gezisi",
    budgetAmount: 1400,
    budgetCurrency: 'USD',
    placesCount: 6,
    tags: [{ label: 'Kültür', icon: 'cafe-outline' }],
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80',
    status: 'completed',
  },
];
