import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { PlanCard } from '@/components/ui/plan-card';
import { ThumbStrip } from '@/components/ui/thumb-strip';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { BottomTabInset, Radii, Spacing } from '@/constants/theme';
import { useCurrentUser } from '@/hooks/data/use-current-user';
import { useDestinations } from '@/hooks/data/use-destinations';
import { usePlans } from '@/hooks/data/use-plans';
import { usePreferences } from '@/hooks/use-preferences';
import { useTheme } from '@/hooks/use-theme';

/** Plan kartı durum filtresi: tümü ya da yalnız aktif. */
type PlanFilter = 'all' | 'active';

/**
 * Explore / Keşfet (`/explore`) — plan-odaklı dashboard.
 *
 * Başlık + avatar → (thumbnail şeridi + "AI ile oluştur" butonu + ipucu) tek kart
 * grubunda → "Keşfet / Planım" sekmeleri + çalışan durum filtreleri → plan kartları
 * (sağda SVG rota çizimi).
 *
 * Veri mock hook'lardan. "AI ile oluştur" butonu `/search`'e gider.
 * TODO(api): planlar GET /plans.
 */
export default function ExploreScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data: user } = useCurrentUser();
  const { displayName } = usePreferences();
  const { data: plans } = usePlans();
  const { data: destinations } = useDestinations();
  const [tab, setTab] = useState('explore');
  const [filter, setFilter] = useState<PlanFilter>('all');

  // Çalışan durum filtresi: 'active' → yalnız aktif planlar.
  const visiblePlans = filter === 'active' ? plans.filter((p) => p.status === 'active') : plans;

  return (
    <ThemedView type="backgroundElement" style={styles.fill}>
      <FlatList
        data={visiblePlans}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.padded}>
            <PlanCard plan={item} onPress={() => router.push(`/plan/${item.id}`)} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.three }]}
        ListHeaderComponent={
          <>
            {/* Başlık + avatar */}
            <View style={[styles.padded, styles.headerRow]}>
              <ThemedText type="h1" style={styles.heading}>
                {t('home:explore.heading')}
              </ThemedText>
              <Avatar uri={user.avatarUrl} name={displayName ?? user.name} size={48} />
            </View>

            <View style={styles.padded}>
              <ThumbStrip
                images={destinations.slice(0, 5).map((d) => d.imageUrl)}
                edgePadding={Spacing.three}
              />
              <View style={styles.promptInner}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('home:explore.createCta')}
                  onPress={() => router.push('/search')}
                  style={({ pressed }) => [styles.createBtn, { opacity: pressed ? 0.85 : 1 }]}
                >
                  <Icon name="sparkles" size={16} color="#fff" />
                  <ThemedText type="small" style={styles.createBtnLabel}>
                    {t('home:explore.createCta')}
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Sekmeler + filtreler */}
            <View style={[styles.padded, styles.tabsRow]}>
              <UnderlineTabs
                options={[
                  { value: 'explore', label: t('home:explore.tabs.explore') },
                  { value: 'myPlan', label: t('home:explore.tabs.myPlan') },
                ]}
                value={tab}
                onChange={setTab}
              />
              <View style={styles.filters}>
                <FilterLabel
                  label={t('home:explore.filters.allPlans')}
                  active={filter === 'all'}
                  activeColor={theme.primary}
                  onPress={() => setFilter('all')}
                />
                <FilterLabel
                  label={t('home:explore.filters.active')}
                  active={filter === 'active'}
                  activeColor={theme.primary}
                  onPress={() => setFilter('active')}
                />
              </View>
            </View>
          </>
        }
      />
    </ThemedView>
  );
}

/** "Tüm Planlar ⌄" / "Aktif ⌄" filtre butonu — seçiliyse marka renginde. */
function FilterLabel({
  label,
  active,
  activeColor,
  onPress,
}: {
  label: string;
  active: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.filter, { opacity: pressed ? 0.6 : 1 }]}
      onPress={onPress}
    >
      <ThemedText
        type="small"
        themeColor={active ? undefined : 'textSecondary'}
        style={active ? { color: activeColor, fontWeight: '700' } : undefined}
      >
        {label}
      </ThemedText>
      <Icon name="chevron-down" size={14} color={active ? activeColor : undefined} themeColor="textSecondary" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingBottom: BottomTabInset + Spacing.four, gap: Spacing.three },
  padded: { paddingHorizontal: Spacing.three },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  heading: { flex: 1 },
  promptInner: { paddingHorizontal: Spacing.three, gap: Spacing.two, alignItems: 'center' },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    alignSelf: 'center',
    backgroundColor: '#000',
    borderRadius: Radii.pill,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  createBtnLabel: { color: '#fff', fontWeight: '700' },
  tabsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filters: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  filter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
});
