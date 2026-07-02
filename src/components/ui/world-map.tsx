import { Pressable, StyleSheet, View } from 'react-native';

import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * WorldMap — pinli dünya haritası (Gezi Günlüğü).
 *
 * Zemin, equirectangular (eş-dikdörtgen) projeksiyonlu bir dünya haritası
 * görseli; pin konumu gerçek lat/lng'den yüzdeye çevrilir, yani her pin
 * coğrafi olarak doğru yere oturur:
 *   x = (lng + 180) / 360, y = (90 - lat) / 180.
 *
 * Gerçek harita SDK'sı (Mapbox, bkz. docs/product-plan.md §5.1) gelince bu
 * bileşen interaktif haritayla değişecek; API'si (pins + onPressPin) korunur.
 */

// Public domain equirectangular dünya haritası (Wikimedia Commons, D. Strebe).
const WORLD_MAP_URI =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1024px-Equirectangular_projection_SW.jpg';

export interface WorldMapPin {
  id: string;
  lat: number;
  lng: number;
  label?: string;
}

export type WorldMapProps = {
  pins: WorldMapPin[];
  onPressPin?: (pin: WorldMapPin) => void;
  /** Seçili pin (vurgulu gösterilir). */
  selectedId?: string | null;
};

export function WorldMap({ pins, onPressPin, selectedId }: WorldMapProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <CachedImage uri={WORLD_MAP_URI} style={cachedImageStyles.fill} decorative />
      {/* Tema ile uyum için hafif scrim (koyu temada haritayı yumuşatır). */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.overlay, opacity: 0.15 }]} pointerEvents="none" />
      {pins.map((pin) => {
        const left = `${((pin.lng + 180) / 360) * 100}%` as const;
        const top = `${((90 - pin.lat) / 180) * 100}%` as const;
        const selected = pin.id === selectedId;
        return (
          <Pressable
            key={pin.id}
            accessibilityRole="button"
            accessibilityLabel={pin.label ?? pin.id}
            hitSlop={8}
            onPress={() => onPressPin?.(pin)}
            style={[styles.pinWrap, { left, top }]}
          >
            <View
              style={[
                styles.pin,
                {
                  backgroundColor: theme.primary,
                  borderColor: '#FFFFFF',
                  transform: [{ scale: selected ? 1.5 : 1 }],
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Equirectangular projeksiyon 2:1'dir; oran korunur ki lat/lng doğru otursun.
  container: { aspectRatio: 2, borderRadius: Radii.lg, overflow: 'hidden' },
  // Pin merkezini koordinata oturt (yarı boyut kadar geri çek).
  pinWrap: { position: 'absolute', marginLeft: -7, marginTop: -7 },
  pin: { width: 14, height: 14, borderRadius: Radii.pill, borderWidth: 2 },
});
