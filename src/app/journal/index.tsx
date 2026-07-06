import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckInForm, type CheckInInput } from '@/components/journal/check-in-form';
import { JournalStats } from '@/components/journal/journal-stats';
import { PinCard } from '@/components/journal/pin-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { WorldMap, type WorldMapPin } from '@/components/ui/world-map';
import { Spacing } from '@/constants/theme';
import { usePins } from '@/hooks/data/use-pins';
import { searchPlaces } from '@/mocks/place-search';
import { MOCK_USER } from '@/mocks/user';
import type { TravelPin } from '@/types';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80';

/**
 * Gezi Günlüğü (`/journal`) — pinli dünya haritası + check-in zaman çizelgesi.
 * Liste FlatList ile sanallaştırılır; harita/istatistik/form başlıkta akar.
 */
export default function JournalScreen() {
  const { data: basePins } = usePins('mine');
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [extraPins, setExtraPins] = useState<TravelPin[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const pins = [...extraPins, ...basePins].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  // Harita pinleri: koordinatı olmayan yerel check-in'ler (0,0) haritaya konmaz.
  const mapPins: WorldMapPin[] = pins
    .filter((p) => p.coordinates.lat !== 0 || p.coordinates.lng !== 0)
    .map((p) => ({ id: p.id, lat: p.coordinates.lat, lng: p.coordinates.lng, label: p.placeName }));
  const selectedPin = pins.find((p) => p.id === selectedPinId) ?? null;

  const addCheckIn = ({ placeName, city, caption }: CheckInInput) => {
    // Şehir mock geocoding listesinde varsa koordinatını al → haritada da görünür.
    const geo = searchPlaces(city)[0];
    setExtraPins((prev) => [
      {
        id: `pin-local-${Date.now()}`,
        userId: MOCK_USER.id,
        userName: MOCK_USER.name,
        userAvatarUrl: MOCK_USER.avatarUrl,
        placeId: `local-${Date.now()}`,
        placeName,
        city,
        countryCode: geo?.countryCode ?? '??',
        coordinates: geo?.coordinates ?? { lat: 0, lng: 0 },
        category: 'other',
        photoUrl: FALLBACK_PHOTO,
        caption: caption || null,
        likeCount: 0,
        likedByMe: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setFormVisible(false);
  };

  return (
    <ThemedView type="backgroundElement" style={styles.fill}>
      <Header
        title={t('pages:journal.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <FlatList
        data={pins}
        keyExtractor={(pin) => pin.id}
        renderItem={({ item }) => <PinCard pin={item} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <ThemedText type="small" themeColor="textSecondary">
              {t('pages:journal.subtitle')}
            </ThemedText>

            {/* Dünya haritası — pine dokununca altta özet çıkar. */}
            <View>
              <WorldMap
                pins={mapPins}
                selectedId={selectedPinId}
                onPressPin={(pin) => setSelectedPinId((prev) => (prev === pin.id ? null : pin.id))}
              />
              {selectedPin && (
                <View style={styles.mapCaption}>
                  <Icon name="location" size={14} themeColor="primary" />
                  <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
                    {selectedPin.placeName} · {selectedPin.city}
                  </ThemedText>
                </View>
              )}
            </View>

            <JournalStats pins={pins} />

            <AppButton
              label={t('pages:journal.addPin')}
              leadingIcon="add-circle-outline"
              variant="secondary"
              onPress={() => setFormVisible((v) => !v)}
            />

            {formVisible && <CheckInForm onSubmit={addCheckIn} />}
          </View>
        }
        ListEmptyComponent={
          <ThemedText type="small" themeColor="textTertiary">
            {t('pages:journal.empty')}
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.three },
  headerContent: { gap: Spacing.three },
  mapCaption: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: Spacing.one },
});
