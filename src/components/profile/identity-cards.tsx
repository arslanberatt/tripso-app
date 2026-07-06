import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { AppInput } from '@/components/ui/input';
import { Radii, Spacing } from '@/constants/theme';
import type { User } from '@/types';

/** Uzun id'yi kısaltır: 111111…7777. */
function shortenId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}

/**
 * IdentityCards — Profil üstündeki üç kart: arama (görsel), kimlik (ad+e-posta,
 * dokununca kişiselleştirme) ve ID/QR satırı.
 */
export function IdentityCards({ user, name, onPressIdentity }: { user: User; name: string; onPressIdentity: () => void }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  return (
    <>
      {/* Arama (görsel; filtre TODO) — kart zeminli, ekrandan ayrışır */}
      <Card radius={Radii.pill}>
        <AppInput
          leadingIcon="search"
          placeholder={t('home:profile.search')}
          value={query}
          onChangeText={setQuery}
          clearable
          returnKeyType="search"
          containerStyle={styles.search}
        />
      </Card>

      {/* Kimlik kartı */}
      <Card radius={Radii.lg}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home:profile.identityA11y')}
          onPress={onPressIdentity}
          style={({ pressed }) => [styles.identity, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Avatar uri={user.avatarUrl} name={name} size={48} />
          <View style={styles.identityText}>
            <ThemedText type="h3" numberOfLines={1}>
              {name}
            </ThemedText>
            <View style={styles.emailRow}>
              <Icon name="mail-outline" size={14} themeColor="textSecondary" />
              <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
                {user.email}
              </ThemedText>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} themeColor="textTertiary" />
        </Pressable>
      </Card>

      {/* ID / QR */}
      <Card radius={Radii.lg}>
        <View style={styles.idRow}>
          <Icon name="card-outline" size={22} themeColor="text" />
          <ThemedText type="small" themeColor="textSecondary" style={styles.idText}>
            {shortenId(user.id)}
          </ThemedText>
          <IconButton icon="qr-code-outline" accessibilityLabel={t('home:profile.qrA11y')} />
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  // Card kendi zemin + köşesini verir; input zemini şeffaf kalsın.
  search: { backgroundColor: 'transparent', paddingHorizontal: Spacing.four },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  identityText: { flex: 1, gap: Spacing.half },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
    minHeight: 52,
  },
  idText: { flex: 1 },
});
