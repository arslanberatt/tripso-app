import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { CachedImage, cachedImageStyles } from '@/components/ui/cached-image';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { AppInput } from '@/components/ui/input';
import { WorldMap, type WorldMapPin } from '@/components/ui/world-map';
import { Radii, Spacing } from '@/constants/theme';
import { usePins } from '@/hooks/data/use-pins';
import { searchPlaces } from '@/mocks/place-search';
import { MOCK_USER } from '@/mocks/user';
import type { TravelPin } from '@/types';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80';

/** Gezi Günlüğü (`/journal`) — check-in yapılan yerlerin zaman çizelgesi. */
export default function JournalScreen() {
  const { data: basePins } = usePins('mine');
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [extraPins, setExtraPins] = useState<TravelPin[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [city, setCity] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const pins = [...extraPins, ...basePins].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  // Harita pinleri: koordinatı olmayan yerel check-in'ler (0,0) haritaya konmaz.
  const mapPins: WorldMapPin[] = pins
    .filter((p) => p.coordinates.lat !== 0 || p.coordinates.lng !== 0)
    .map((p) => ({ id: p.id, lat: p.coordinates.lat, lng: p.coordinates.lng, label: p.placeName }));
  const selectedPin = pins.find((p) => p.id === selectedPinId) ?? null;

  const stats = useMemo(() => {
    const cities = new Set(pins.map((p) => p.city));
    const countries = new Set(pins.map((p) => p.countryCode));
    return { countries: countries.size, cities: cities.size, places: pins.length };
  }, [pins]);

  const addCheckIn = () => {
    if (!placeName.trim() || !city.trim()) return;
    // Şehir mock geocoding listesinde varsa koordinatını al → haritada da görünür.
    const geo = searchPlaces(city)[0];
    setExtraPins((prev) => [
      {
        id: `pin-local-${Date.now()}`,
        userId: MOCK_USER.id,
        userName: MOCK_USER.name,
        userAvatarUrl: MOCK_USER.avatarUrl,
        placeId: `local-${Date.now()}`,
        placeName: placeName.trim(),
        city: city.trim(),
        countryCode: geo?.countryCode ?? '??',
        coordinates: geo?.coordinates ?? { lat: 0, lng: 0 },
        category: 'other',
        photoUrl: FALLBACK_PHOTO,
        caption: caption.trim() || null,
        likeCount: 0,
        likedByMe: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setPlaceName('');
    setCity('');
    setCaption('');
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        <View style={styles.padded}>
          <ThemedText type="small" themeColor="textSecondary">
            {t('pages:journal.subtitle')}
          </ThemedText>
        </View>

        {/* Dünya haritası — gezilen yerler pinli; pine dokununca altta özet çıkar. */}
        <View style={styles.padded}>
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

        <View style={styles.padded}>
          <Card radius={Radii.lg}>
            <View style={styles.statsRow}>
              <Stat value={stats.countries} label={t('pages:journal.stats.countries', { count: stats.countries })} />
              <Stat value={stats.cities} label={t('pages:journal.stats.cities', { count: stats.cities })} />
              <Stat value={stats.places} label={t('pages:journal.stats.places', { count: stats.places })} />
            </View>
          </Card>
        </View>

        <View style={styles.padded}>
          <AppButton
            label={t('pages:journal.addPin')}
            leadingIcon="add-circle-outline"
            variant="secondary"
            onPress={() => setFormVisible((v) => !v)}
          />
        </View>

        {formVisible && (
          <View style={styles.padded}>
            <Card radius={Radii.lg}>
              <View style={styles.form}>
                <ThemedText type="h3">{t('pages:journal.addPinTitle')}</ThemedText>
                <AppInput placeholder={t('pages:journal.placeName')} value={placeName} onChangeText={setPlaceName} />
                <AppInput placeholder={t('pages:journal.city')} value={city} onChangeText={setCity} />
                <AppInput placeholder={t('pages:journal.caption')} value={caption} onChangeText={setCaption} />
                <AppButton label={t('pages:journal.save')} onPress={addCheckIn} />
              </View>
            </Card>
          </View>
        )}

        <View style={[styles.padded, styles.list]}>
          {pins.length === 0 ? (
            <ThemedText type="small" themeColor="textTertiary">
              {t('pages:journal.empty')}
            </ThemedText>
          ) : (
            pins.map((pin) => (
              <Card key={pin.id} radius={Radii.lg}>
                <Pressable
                  accessibilityRole={pin.placeId.startsWith('local-') ? undefined : 'button'}
                  onPress={pin.placeId.startsWith('local-') ? undefined : () => router.push(`/place/${pin.placeId}`)}
                  style={styles.row}
                >
                  <View style={styles.imageWrap}>
                    <CachedImage uri={pin.photoUrl} style={cachedImageStyles.fill} recyclingKey={pin.id} radius={Radii.md} />
                  </View>
                  <View style={styles.body}>
                    <ThemedText type="h3" numberOfLines={1}>
                      {pin.placeName}
                    </ThemedText>
                    <View style={styles.metaRow}>
                      <Icon name="location-outline" size={14} themeColor="textSecondary" />
                      <ThemedText type="caption" themeColor="textSecondary">
                        {pin.city}
                      </ThemedText>
                    </View>
                    {pin.caption && (
                      <ThemedText type="caption" themeColor="textTertiary" numberOfLines={2}>
                        {pin.caption}
                      </ThemedText>
                    )}
                  </View>
                </Pressable>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="h2">{value}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { gap: Spacing.three },
  padded: { paddingHorizontal: Spacing.three },
  mapCaption: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: Spacing.one },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: Spacing.three },
  stat: { alignItems: 'center', gap: 2 },
  form: { gap: Spacing.two, padding: Spacing.three },
  list: { gap: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.three, padding: Spacing.three },
  imageWrap: { width: 72, height: 72, borderRadius: Radii.md, overflow: 'hidden' },
  body: { flex: 1, gap: Spacing.one },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
