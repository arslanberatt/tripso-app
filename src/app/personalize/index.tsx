import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Header } from '@/components/ui/header';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { AppInput } from '@/components/ui/input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Radii, Spacing } from '@/constants/theme';
import { useProfile } from '@/hooks/data/use-profile';
import { usePreferences } from '@/hooks/use-preferences';
import { useTheme } from '@/hooks/use-theme';
import { updateProfile } from '@/mocks/profile-store';
import type { AccommodationTier, Alcohol, Pace } from '@/types';

const AGE_GROUPS = ['18_24', '25_34', '35_44', '45_54', '55_plus'] as const;
const ALCOHOL_OPTIONS: Alcohol[] = ['yes', 'occasional', 'no'];
const DIETARY_OPTIONS = ['none', 'vegetarian', 'vegan', 'halal', 'gluten_free'] as const;
const PACE_OPTIONS: Pace[] = ['relaxed', 'balanced', 'intense'];
const ACCOMMODATION_TIERS: AccommodationTier[] = ['economy', 'standard', 'comfort', 'luxury'];

const INTEREST_OPTIONS: { key: string; label: string; icon: IconName }[] = [
  { key: 'culture', label: 'Kültür & Tarih', icon: 'business-outline' },
  { key: 'food', label: 'Yeme & İçme', icon: 'restaurant-outline' },
  { key: 'nature', label: 'Doğa', icon: 'leaf-outline' },
  { key: 'nightlife', label: 'Gece Hayatı', icon: 'wine-outline' },
  { key: 'art', label: 'Sanat & Müze', icon: 'color-palette-outline' },
  { key: 'shopping', label: 'Alışveriş', icon: 'bag-outline' },
  { key: 'photography', label: 'Fotoğraf', icon: 'camera-outline' },
  { key: 'sports', label: 'Spor & Macera', icon: 'trail-sign-outline' },
];

const STEP_COUNT = 5;

/**
 * Personalize (`/personalize`) — çok adımlı kişiselleştirme sihirbazı (modal).
 *
 * Ad + yaş → alkol + diyet → tempo + konaklama → ilgi alanları → özet.
 * Ad `usePreferences.setDisplayName` ile kalıcı; diğer alanlar `profile-store`'a
 * (mock) yazılır ve AI plan önerilerinin `ProfileSnapshot`'ını besler.
 */
export default function PersonalizeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data } = useProfile();
  const { displayName, setDisplayName } = usePreferences();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [name, setName] = useState(displayName ?? data.user.name);
  const [ageGroup, setAgeGroup] = useState<string>(
    AGE_GROUPS.includes(data.profile.ageGroup as (typeof AGE_GROUPS)[number])
      ? data.profile.ageGroup
      : '25_34',
  );
  const [alcohol, setAlcohol] = useState<Alcohol>(data.profile.alcohol);
  const [dietary, setDietary] = useState<string[]>(
    data.profile.dietary.length > 0 ? data.profile.dietary : ['none'],
  );
  const [pace, setPace] = useState<Pace>(data.profile.pace);
  const [accommodation, setAccommodation] = useState<AccommodationTier>(data.profile.accommodationTier);
  const [interests, setInterests] = useState<string[]>(data.profile.interests);

  const toggleDietary = (key: string) =>
    setDietary((prev) => {
      // "Kısıtlama yok" diğerlerini temizler; başka bir seçim "yok"u kaldırır.
      if (key === 'none') return ['none'];
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev.filter((k) => k !== 'none'), key];
      return next.length > 0 ? next : ['none'];
    });

  const toggleInterest = (key: string) =>
    setInterests((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const save = () => {
    void setDisplayName(name);
    updateProfile({
      ageGroup,
      alcohol,
      dietary: dietary.filter((d) => d !== 'none'),
      pace,
      accommodationTier: accommodation,
      interests,
    });
    setDone(true);
  };

  const goNext = () => {
    if (step < STEP_COUNT - 1) setStep((s) => s + 1);
    else save();
  };
  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  };

  if (done) {
    return (
      <ThemedView style={styles.doneScreen}>
        <Icon name="checkmark-circle" size={56} themeColor="primary" />
        <ThemedText type="h1" style={styles.center}>
          {t('pages:personalize.saved')}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {t('pages:personalize.savedMessage')}
        </ThemedText>
        <AppButton label={t('pages:personalize.done')} fullWidth={false} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:personalize.title')}
        leading={
          <IconButton icon="close" accessibilityLabel={t('common:close')} onPress={() => router.back()} />
        }
      />
      <View style={styles.progressWrap}>
        <ThemedText type="caption" themeColor="textSecondary">
          {t('pages:personalize.step', { current: step + 1, total: STEP_COUNT })}
        </ThemedText>
        <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.primary, width: `${((step + 1) / STEP_COUNT) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}
      >
        {step === 0 && (
          <View style={styles.stepGap}>
            <StepHeading title={t('pages:personalize.about.title')} subtitle={t('pages:personalize.about.subtitle')} />
            <View style={styles.fieldGap}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('pages:personalize.about.nameLabel')}
              </ThemedText>
              <AppInput
                leadingIcon="person-outline"
                value={name}
                onChangeText={setName}
                placeholder={t('pages:personalize.about.namePlaceholder')}
              />
            </View>
            <View style={styles.fieldGap}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('pages:personalize.about.ageLabel')}
              </ThemedText>
              <View style={styles.chipWrap}>
                {AGE_GROUPS.map((g) => (
                  <Chip
                    key={g}
                    label={t(`pages:personalize.ageGroup.${g}`)}
                    selected={ageGroup === g}
                    onPress={() => setAgeGroup(g)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepGap}>
            <StepHeading title={t('pages:personalize.tastes.title')} subtitle={t('pages:personalize.tastes.subtitle')} />
            <View style={styles.fieldGap}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('pages:personalize.tastes.alcoholLabel')}
              </ThemedText>
              <SegmentedControl
                options={ALCOHOL_OPTIONS.map((a) => ({ value: a, label: t(`pages:personalize.alcohol.${a}`) }))}
                value={alcohol}
                onChange={setAlcohol}
              />
            </View>
            <View style={styles.fieldGap}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('pages:personalize.tastes.dietaryLabel')}
              </ThemedText>
              <View style={styles.chipWrap}>
                {DIETARY_OPTIONS.map((d) => (
                  <Chip
                    key={d}
                    label={t(`pages:personalize.dietary.${d}`)}
                    selected={dietary.includes(d)}
                    onPress={() => toggleDietary(d)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepGap}>
            <StepHeading title={t('pages:personalize.style.title')} subtitle={t('pages:personalize.style.subtitle')} />
            <View style={styles.fieldGap}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('pages:personalize.style.paceLabel')}
              </ThemedText>
              <SegmentedControl
                options={PACE_OPTIONS.map((p) => ({ value: p, label: t(`pages:personalize.pace.${p}`) }))}
                value={pace}
                onChange={setPace}
              />
            </View>
            <View style={styles.fieldGap}>
              <ThemedText type="small" themeColor="textSecondary">
                {t('pages:personalize.style.accommodationLabel')}
              </ThemedText>
              <View style={styles.chipWrap}>
                {ACCOMMODATION_TIERS.map((a) => (
                  <Chip
                    key={a}
                    label={t(`pages:budgetTier.${a}`)}
                    selected={accommodation === a}
                    onPress={() => setAccommodation(a)}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepGap}>
            <StepHeading
              title={t('pages:personalize.interests.title')}
              subtitle={t('pages:personalize.interests.subtitle')}
            />
            <View style={styles.chipWrap}>
              {INTEREST_OPTIONS.map((opt) => (
                <Chip
                  key={opt.key}
                  label={opt.label}
                  icon={opt.icon}
                  selected={interests.includes(opt.key)}
                  onPress={() => toggleInterest(opt.key)}
                />
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepGap}>
            <StepHeading title={t('pages:personalize.review.title')} subtitle={t('pages:personalize.review.subtitle')} />
            <Card radius={Radii.lg}>
              <View style={styles.reviewCard}>
                <ReviewRow icon="person-outline" label={t('pages:personalize.review.nameLabel')} value={name || '—'} />
                <ReviewRow
                  icon="calendar-outline"
                  label={t('pages:personalize.review.ageLabel')}
                  value={t(`pages:personalize.ageGroup.${ageGroup}`)}
                />
                <ReviewRow
                  icon="wine-outline"
                  label={t('pages:personalize.review.alcoholLabel')}
                  value={t(`pages:personalize.alcohol.${alcohol}`)}
                />
                <ReviewRow
                  icon="restaurant-outline"
                  label={t('pages:personalize.review.dietaryLabel')}
                  value={dietary.map((d) => t(`pages:personalize.dietary.${d}`)).join(', ')}
                />
                <ReviewRow
                  icon="walk-outline"
                  label={t('pages:personalize.review.paceLabel')}
                  value={t(`pages:personalize.pace.${pace}`)}
                />
                <ReviewRow
                  icon="bed-outline"
                  label={t('pages:personalize.review.accommodationLabel')}
                  value={t(`pages:budgetTier.${accommodation}`)}
                />
                <ReviewRow
                  icon="heart-outline"
                  label={t('pages:personalize.review.interestsLabel')}
                  value={
                    interests.length > 0
                      ? INTEREST_OPTIONS.filter((o) => interests.includes(o.key))
                          .map((o) => o.label)
                          .join(', ')
                      : '—'
                  }
                />
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, paddingBottom: insets.bottom + Spacing.two }]}>
        <View style={styles.footerRow}>
          <View style={styles.footerBtn}>
            <AppButton label={t('pages:personalize.back')} variant="secondary" onPress={goBack} />
          </View>
          <View style={styles.footerBtnGrow}>
            <AppButton
              label={step === STEP_COUNT - 1 ? t('pages:personalize.save') : t('pages:personalize.next')}
              trailingIcon={step === STEP_COUNT - 1 ? 'checkmark' : 'chevron-forward'}
              disabled={step === 0 && name.trim().length === 0}
              onPress={goNext}
            />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.heading}>
      <ThemedText type="h1">{title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {subtitle}
      </ThemedText>
    </View>
  );
}

function ReviewRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Icon name={icon} size={18} themeColor="textSecondary" />
      <View style={styles.reviewText}>
        <ThemedText type="caption" themeColor="textTertiary">
          {label}
        </ThemedText>
        <ThemedText type="small">{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  progressWrap: { paddingHorizontal: Spacing.four, gap: Spacing.one, paddingBottom: Spacing.two },
  progressTrack: { height: 4, borderRadius: Radii.pill, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: Radii.pill },
  content: { paddingHorizontal: Spacing.four, gap: Spacing.four },
  heading: { gap: Spacing.one },
  stepGap: { gap: Spacing.three },
  fieldGap: { gap: Spacing.one },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  reviewCard: { gap: Spacing.three, padding: Spacing.three },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  reviewText: { flex: 1, gap: 2 },
  footer: { padding: Spacing.four, paddingTop: Spacing.two, borderTopWidth: StyleSheet.hairlineWidth },
  footerRow: { flexDirection: 'row', gap: Spacing.two },
  footerBtn: { minWidth: 96 },
  footerBtnGrow: { flex: 1 },
  center: { textAlign: 'center' },
  doneScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.five },
});
