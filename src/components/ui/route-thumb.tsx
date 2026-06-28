import { Image, type ImageSource } from 'expo-image';
import { StyleSheet } from 'react-native';

import { Radii } from '@/constants/theme';

/**
 * RouteThumb — plan kartının sağındaki stilize rota-harita görseli.
 *
 * Hazır placeholder map görsellerinden (pinli foto kareleri + rota çizgisi)
 * birini kart `seed`'inden (id) deterministik seçer — her kart farklı görünür
 * ama her render aynı kalır. Görseller beyaz zeminli olduğundan `contain`.
 */
const MAPS: ImageSource[] = [
  require('@/assets/images/placeholders/map1.webp'),
  require('@/assets/images/placeholders/map2.webp'),
  require('@/assets/images/placeholders/map3.webp'),
];

export type RouteThumbProps = {
  /** Deterministik seçim için tohum (kart id'si). */
  seed: string;
  size?: number;
};

/** seed string'inden basit bir hash (deterministik indeks için). */
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function RouteThumb({ seed, size = 96 }: RouteThumbProps) {
  const source = MAPS[hash(seed) % MAPS.length];

  return (
    <Image
      source={source}
      style={[styles.image, { width: size, height: size }]}
      contentFit="contain"
      transition={200}
      accessibilityRole="image"
    />
  );
}

const styles = StyleSheet.create({
  image: { borderRadius: Radii.md },
});
