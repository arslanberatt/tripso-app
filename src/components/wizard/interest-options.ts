import type { IconName } from '@/components/ui/icon';

/**
 * Ortak ilgi alanı kataloğu — Trip Sihirbazı ve Kişiselleştirme aynı listeyi
 * kullanır. Etiket i18n'den çözülür: `t('pages:interests.<key>')`.
 * TODO(api): admin panelinden yönetilecek (bkz. docs/admin-panel-expectations.json).
 */
export const INTEREST_OPTIONS: { key: string; icon: IconName }[] = [
  { key: 'culture', icon: 'business-outline' },
  { key: 'food', icon: 'restaurant-outline' },
  { key: 'nature', icon: 'leaf-outline' },
  { key: 'nightlife', icon: 'wine-outline' },
  { key: 'art', icon: 'color-palette-outline' },
  { key: 'shopping', icon: 'bag-outline' },
  { key: 'relaxation', icon: 'sunny-outline' },
  { key: 'adventure', icon: 'trail-sign-outline' },
  { key: 'photography', icon: 'camera-outline' },
  { key: 'sports', icon: 'bicycle-outline' },
];
