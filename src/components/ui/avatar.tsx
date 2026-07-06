import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CachedImage } from '@/components/ui/cached-image';
import { Radii } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Avatar — kullanıcı görseli. `uri` varsa CachedImage, yoksa isimden türetilen
 * baş harf rozeti (fallback). HomeHeader ve Profile bunu kullanır.
 */
export type AvatarProps = {
  uri?: string | null;
  /** Fallback baş harf için isim. */
  name?: string;
  size?: number;
};

export function Avatar({ uri, name, size = 44 }: AvatarProps) {
  const theme = useTheme();
  const circle = { width: size, height: size, borderRadius: Radii.pill };

  if (uri) {
    return (
      <CachedImage
        uri={uri}
        displayWidth={size}
        radius={Radii.pill}
        style={circle}
        accessibilityLabel={name ? `${name} avatar` : 'User avatar'}
      />
    );
  }

  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <View
      accessibilityLabel={name ? `${name} avatar` : 'User avatar'}
      style={[circle, styles.fallback, { backgroundColor: theme.backgroundSelected }]}
    >
      <ThemedText type="h3" style={{ fontSize: size * 0.4 }}>
        {initial}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
