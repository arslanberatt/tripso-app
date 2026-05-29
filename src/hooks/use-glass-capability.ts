import { isLiquidGlassAvailable } from 'expo-glass-effect';

/**
 * Cihazın Apple "Liquid Glass" tasarımını destekleyip desteklemediği.
 *
 * `expo-glass-effect`'in `isLiquidGlassAvailable()` fonksiyonu:
 *  - iOS 26+ (Liquid Glass mevcut) → `true`
 *  - eski iOS / Android / web → `false`
 *
 * Değer uygulama oturumu boyunca sabittir, bu yüzden modül seviyesinde bir kez
 * hesaplanır (her render'da native köprüye gitmemek için).
 */
const LIQUID_GLASS = isLiquidGlassAvailable();

export interface GlassCapability {
  /** iOS 26+ gerçek Liquid Glass kullanılabilir mi? */
  isLiquidGlass: boolean;
}

export function useGlassCapability(): GlassCapability {
  return { isLiquidGlass: LIQUID_GLASS };
}
