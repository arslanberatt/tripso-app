import { Image, type ImageContentFit, type ImageProps, type ImageStyle } from 'expo-image';
import { StyleSheet, type StyleProp } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { sizedUri } from '@/utils/image';

/**
 * CachedImage — ağdan gelen görseller için `expo-image` sarmalı.
 *
 * `expo-image` zaten disk + bellek cache yapar; bu component üstüne tutarlı
 * varsayılanlar koyar: yumuşak geçiş (fade), blurhash placeholder, tema rengiyle
 * arka plan ve liste geri-dönüşümü için `recyclingKey`.
 *
 * Erişilebilirlik: dekoratif olmayan görseller için `accessibilityLabel` ver;
 * dekoratifse `decorative` propunu true yap (ekran okuyucudan gizlenir).
 */
export type CachedImageProps = Omit<ImageProps, 'style'> & {
  /** Ağ URL'si (ya da expo-image source). */
  uri: string;
  /**
   * Görselin ekranda kaplayacağı genişlik (dp). Verilirse Unsplash URL'leri
   * cihaz yoğunluğuna göre küçültülür (bkz. utils/image.ts) — 92px kutuya
   * 1200px görsel indirilmesini önler. Bilinmiyorsa boş bırak.
   */
  displayWidth?: number;
  /** contentFit (default: 'cover'). */
  contentFit?: ImageContentFit;
  /** Köşe yarıçapı kısayolu. */
  radius?: number;
  /** Liste hücrelerinde doğru görselin gösterimi için (örn. item.id). */
  recyclingKey?: string;
  /** Dekoratif görsel → ekran okuyucudan gizle. */
  decorative?: boolean;
  /** Anlamlı görseller için etiket. */
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
};

// Düz, hafif bir blurhash placeholder (yükleme sırasında boş gri yerine).
const DEFAULT_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function CachedImage({
  uri,
  displayWidth,
  contentFit = 'cover',
  radius,
  recyclingKey,
  decorative,
  accessibilityLabel,
  placeholder,
  style,
  ...rest
}: CachedImageProps) {
  const theme = useTheme();

  return (
    <Image
      source={{ uri: displayWidth ? sizedUri(uri, displayWidth) : uri }}
      placeholder={placeholder ?? { blurhash: DEFAULT_BLURHASH }}
      contentFit={contentFit}
      transition={250}
      recyclingKey={recyclingKey}
      cachePolicy="memory-disk"
      accessible={!decorative}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      style={[
        { backgroundColor: theme.backgroundElement },
        radius != null && { borderRadius: radius },
        style,
      ]}
      {...rest}
    />
  );
}

export const cachedImageStyles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
});
