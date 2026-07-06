import { PixelRatio } from 'react-native';

/**
 * sizedUri — uzak görsel URL'sini gösterim genişliğine göre küçültür.
 *
 * Sorun: mock/API görselleri tam çözünürlük (`w=900–1200`) dönerken kartlar
 * 56–220px kutularda gösteriyor; küçük kutuda büyük JPEG indirme + decode
 * maliyeti gerçek cihazlarda kasmanın ana kaynağı.
 *
 * Yalnızca Unsplash CDN URL'lerindeki `w=` parametresini yeniden yazar; başka
 * her URL (ileride API'den gelecek görseller dahil) olduğu gibi döner. Piksel
 * hesabı cihaz yoğunluğuna göredir, cache tekrar kullanımı için 100'lük dilime
 * yuvarlanır ve orijinal `w=` değerini asla AŞMAZ (upscale yok).
 */
export function sizedUri(uri: string, displayWidth: number): string {
  if (!uri.includes('images.unsplash.com') || displayWidth <= 0) return uri;

  const match = uri.match(/([?&])w=(\d+)/);
  if (!match) return uri;

  const originalWidth = Number(match[2]);
  const devicePx = PixelRatio.getPixelSizeForLayoutSize(displayWidth);
  const bucketed = Math.ceil(devicePx / 100) * 100;
  const target = Math.min(bucketed, originalWidth);
  if (target >= originalWidth) return uri;

  return uri.replace(/([?&])w=\d+/, `$1w=${target}`);
}
