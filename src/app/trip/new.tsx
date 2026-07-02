import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Radii, Spacing } from '@/constants/theme';
import { usePlaceSearch } from '@/hooks/data/use-place-search';
import { useTheme } from '@/hooks/use-theme';
import { createTrip } from '@/mocks/trip-draft-store';
import type { PlaceSearchResultVM } from '@/mocks/place-search';
import type { BudgetTier, DateFlexibility, Occasion, Travelers } from '@/types';

const INTEREST_OPTIONS: { key: string; label: string; icon: IconName }[] = [
  { key: 'culture', label: 'Kültür & Tarih', icon: 'business-outline' },
  { key: 'food', label: 'Yeme & İçme', icon: 'restaurant-outline' },
  { key: 'nature', label: 'Doğa', icon: 'leaf-outline' },
  { key: 'nightlife', label: 'Gece Hayatı', icon: 'wine-outline' },
  { key: 'art', label: 'Sanat & Müze', icon: 'color-palette-outline' },
  { key: 'shopping', label: 'Alışveriş', icon: 'bag-outline' },
  { key: 'relaxation', label: 'Dinlence', icon: 'sunny-outline' },
  { key: 'adventure', label: 'Macera', icon: 'trail-sign-outline' },
];

const BUDGET_TIERS: BudgetTier[] = ['economy', 'standard', 'comfort', 'luxury'];
const OCCASIONS: Occasion[] = ['honeymoon', 'birthday', 'anniversary', 'business_leisure', 'family_visit'];
const STEP_COUNT = 6;

/**
 * New Trip (`/trip/new`) — Trip Sihirbazı (modal).
 *
 * 6 adım: destinasyon (API destekli autocomplete, serbest metin yok) → tarihler →
 * bütçe → yolcular + occasion → ilgi alanları → özet. Son adımda "generating"
 * durumuna geçer (sahte AI üretim animasyonu) ve `mocks/trip-draft-store`'a yeni
 * bir `Trip` yazıp `/plan/[id]`'e yönlendirir.
 */
export default function NewTripScreen() {
  const { city, country } = useLocalSearchParams<{ city?: string; country?: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'form' | 'generating'>('form');
  const [generatingStep, setGeneratingStep] = useState(0);

  const [query, setQuery] = useState(city ?? '');
  const [destination, setDestination] = useState<PlaceSearchResultVM | null>(() =>
    city && country
      ? { id: `prefill-${city}`, city, countryCode: country, countryName: country, coordinates: { lat: 0, lng: 0 } }
      : null,
  );
  const { data: searchResults } = usePlaceSearch(query);

  const [dateFlexibility, setDateFlexibility] = useState<DateFlexibility>('exact');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [budgetTier, setBudgetTier] = useState<BudgetTier>('standard');
  const [budgetAmount, setBudgetAmount] = useState('');

  const [travelers, setTravelers] = useState<Travelers>({ adults: 2, children: 0, seniors: 0 });
  const [occasion, setOccasion] = useState<Occasion | null>(null);

  const [interests, setInterests] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (phase !== 'generating') return;
    const interval = setInterval(() => setGeneratingStep((s) => Math.min(s + 1, 3)), 700);
    const timeout = setTimeout(() => {
      const trip = createTrip({
        destinationCity: destination!.city,
        destinationCountryCode: destination!.countryCode,
        startDate: startDate || '2026-09-01',
        endDate: endDate || '2026-09-07',
        dateFlexibility,
        travelers,
        budgetTier,
        budgetAmount: budgetAmount ? Number(budgetAmount) : null,
        budgetCurrency: budgetAmount ? 'USD' : null,
        occasion,
        travelFocus: interests,
        tripSpecificInterests: interests,
        freeTextNotes: notes || null,
      });
      router.replace(`/plan/${trip.id}`);
    }, 2800);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const toggleInterest = (key: string) =>
    setInterests((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const canProceed = useMemo(() => {
    if (step === 0) return destination != null;
    if (step === 1) return startDate.trim().length > 0 && endDate.trim().length > 0;
    return true;
  }, [step, destination, startDate, endDate]);

  const goNext = () => {
    if (step < STEP_COUNT - 1) setStep((s) => s + 1);
    else setPhase('generating');
  };
  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  };

  if (phase === 'generating') {
    const generatingSteps = [
      t('pages:wizard.generating.step1'),
      t('pages:wizard.generating.step2', { city: destination?.city ?? '' }),
      t('pages:wizard.generating.step3'),
      t('pages:wizard.generating.step4'),
    ];
    return (
      <ThemedView style={styles.generating}>
        <Icon name="sparkles" size={48} themeColor="primary" />
        <ThemedText type="h1" style={styles.center}>
          {t('pages:wizard.generating.title')}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {t('pages:wizard.generating.message', { city: destination?.city ?? '' })}
        </ThemedText>
        <View style={styles.generatingSteps}>
          {generatingSteps.map((label, i) => (
            <View key={label} style={styles.generatingRow}>
              <Icon
                name={i <= generatingStep ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                themeColor={i <= generatingStep ? 'primary' : 'textTertiary'}
              />
              <ThemedText type="small" themeColor={i <= generatingStep ? 'text' : 'textTertiary'}>
                {label}
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:wizard.title')}
        leading={
          <IconButton icon="close" accessibilityLabel={t('common:close')} onPress={() => router.back()} />
        }
      />
      <View style={styles.progressWrap}>
        <ThemedText type="caption" themeColor="textSecondary">
          {t('pages:wizard.step', { current: step + 1, total: STEP_COUNT })}
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
          <DestinationStep
            query={query}
            setQuery={setQuery}
            results={searchResults}
            destination={destination}
            onSelect={(d) => {
              setDestination(d);
              setQuery(d.city);
            }}
            onClear={() => {
              setDestination(null);
              setQuery('');
            }}
          />
        )}
        {step === 1 && (
          <DatesStep
            dateFlexibility={dateFlexibility}
            setDateFlexibility={setDateFlexibility}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        )}
        {step === 2 && (
          <BudgetStep
            budgetTier={budgetTier}
            setBudgetTier={setBudgetTier}
            budgetAmount={budgetAmount}
            setBudgetAmount={setBudgetAmount}
          />
        )}
        {step === 3 && (
          <TravelersStep
            travelers={travelers}
            setTravelers={setTravelers}
            occasion={occasion}
            setOccasion={setOccasion}
          />
        )}
        {step === 4 && (
          <InterestsStep
            interests={interests}
            toggleInterest={toggleInterest}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {step === 5 && (
          <ReviewStep
            destination={destination}
            dateFlexibility={dateFlexibility}
            startDate={startDate}
            endDate={endDate}
            budgetTier={budgetTier}
            budgetAmount={budgetAmount}
            travelers={travelers}
            occasion={occasion}
            interests={interests}
          />
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, paddingBottom: insets.bottom + Spacing.two }]}>
        <View style={styles.footerRow}>
          <View style={styles.footerBtn}>
            <AppButton label={t('pages:wizard.back')} variant="secondary" onPress={goBack} />
          </View>
          <View style={styles.footerBtnGrow}>
            <AppButton
              label={step === STEP_COUNT - 1 ? t('pages:wizard.create') : t('pages:wizard.next')}
              trailingIcon={step === STEP_COUNT - 1 ? 'sparkles' : 'chevron-forward'}
              disabled={!canProceed}
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

function DestinationStep({
  query,
  setQuery,
  results,
  destination,
  onSelect,
  onClear,
}: {
  query: string;
  setQuery: (v: string) => void;
  results: PlaceSearchResultVM[];
  destination: PlaceSearchResultVM | null;
  onSelect: (d: PlaceSearchResultVM) => void;
  onClear: () => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.stepGap}>
      <StepHeading
        title={t('pages:wizard.destination.title')}
        subtitle={t('pages:wizard.destination.subtitle')}
      />

      {destination ? (
        <Card radius={Radii.lg}>
          <View style={styles.selectedRow}>
            <Icon name="location" size={20} themeColor="primary" />
            <View style={styles.selectedText}>
              <ThemedText type="h3">{destination.city}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary">
                {destination.countryName}
              </ThemedText>
            </View>
            <IconButton icon="close-circle" accessibilityLabel={t('common:clear')} onPress={onClear} />
          </View>
        </Card>
      ) : (
        <>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('pages:wizard.destination.placeholder')}
            autoFocus
          />
          <View style={styles.resultList}>
            {results.length === 0 ? (
              <ThemedText type="small" themeColor="textTertiary">
                {t('pages:wizard.destination.empty')}
              </ThemedText>
            ) : (
              results.map((r) => (
                <Pressable
                  key={r.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${r.city}, ${r.countryName}`}
                  onPress={() => onSelect(r)}
                  style={({ pressed }) => [
                    styles.resultRow,
                    { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Icon name="location-outline" size={18} themeColor="textSecondary" />
                  <View style={styles.selectedText}>
                    <ThemedText type="small">{r.city}</ThemedText>
                    <ThemedText type="caption" themeColor="textTertiary">
                      {r.countryName}
                    </ThemedText>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </>
      )}
    </View>
  );
}

function DatesStep({
  dateFlexibility,
  setDateFlexibility,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: {
  dateFlexibility: DateFlexibility;
  setDateFlexibility: (v: DateFlexibility) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.dates.title')} subtitle={t('pages:wizard.dates.subtitle')} />
      <SegmentedControl
        options={[
          { value: 'exact', label: t('pages:dateFlexibility.exact') },
          { value: 'month', label: t('pages:dateFlexibility.month') },
          { value: 'flexible', label: t('pages:dateFlexibility.flexible') },
        ]}
        value={dateFlexibility}
        onChange={setDateFlexibility}
      />
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:wizard.dates.startDate')}
        </ThemedText>
        <AppInput
          leadingIcon="calendar-outline"
          value={startDate}
          onChangeText={setStartDate}
          placeholder={t('pages:wizard.dates.datePlaceholder')}
        />
      </View>
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:wizard.dates.endDate')}
        </ThemedText>
        <AppInput
          leadingIcon="calendar-outline"
          value={endDate}
          onChangeText={setEndDate}
          placeholder={t('pages:wizard.dates.datePlaceholder')}
        />
      </View>
    </View>
  );
}

function BudgetStep({
  budgetTier,
  setBudgetTier,
  budgetAmount,
  setBudgetAmount,
}: {
  budgetTier: BudgetTier;
  setBudgetTier: (v: BudgetTier) => void;
  budgetAmount: string;
  setBudgetAmount: (v: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.budget.title')} subtitle={t('pages:wizard.budget.subtitle')} />
      <View style={styles.chipWrap}>
        {BUDGET_TIERS.map((tier) => (
          <Chip
            key={tier}
            label={t(`pages:budgetTier.${tier}`)}
            selected={budgetTier === tier}
            onPress={() => setBudgetTier(tier)}
          />
        ))}
      </View>
      <View style={styles.fieldGap}>
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:wizard.budget.amountLabel')}
        </ThemedText>
        <AppInput
          leadingIcon="cash-outline"
          value={budgetAmount}
          onChangeText={setBudgetAmount}
          keyboardType="numeric"
          placeholder={t('pages:wizard.budget.amountPlaceholder')}
        />
      </View>
    </View>
  );
}

function Stepper({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  const theme = useTheme();
  return (
    <View style={styles.stepperRow}>
      <ThemedText type="small" style={styles.stepperLabel}>
        {label}
      </ThemedText>
      <View style={styles.stepperControls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} azalt`}
          onPress={() => onChange(Math.max(min, value - 1))}
          style={[styles.stepperBtn, { backgroundColor: theme.backgroundElement }]}
        >
          <Icon name="remove" size={16} />
        </Pressable>
        <ThemedText type="small" style={styles.stepperValue}>
          {value}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} artır`}
          onPress={() => onChange(value + 1)}
          style={[styles.stepperBtn, { backgroundColor: theme.backgroundElement }]}
        >
          <Icon name="add" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

function TravelersStep({
  travelers,
  setTravelers,
  occasion,
  setOccasion,
}: {
  travelers: Travelers;
  setTravelers: (v: Travelers) => void;
  occasion: Occasion | null;
  setOccasion: (v: Occasion | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.travelers.title')} subtitle={t('pages:wizard.travelers.subtitle')} />
      <Card radius={Radii.lg}>
        <View style={styles.stepperCard}>
          <Stepper
            label={t('pages:wizard.travelers.adults')}
            value={travelers.adults}
            min={1}
            onChange={(adults) => setTravelers({ ...travelers, adults })}
          />
          <Stepper
            label={t('pages:wizard.travelers.children')}
            value={travelers.children ?? 0}
            onChange={(children) => setTravelers({ ...travelers, children })}
          />
          <Stepper
            label={t('pages:wizard.travelers.seniors')}
            value={travelers.seniors ?? 0}
            onChange={(seniors) => setTravelers({ ...travelers, seniors })}
          />
        </View>
      </Card>

      <ThemedText type="small" themeColor="textSecondary" style={styles.occasionLabel}>
        {t('pages:wizard.travelers.occasionLabel')}
      </ThemedText>
      <View style={styles.chipWrap}>
        <Chip
          label={t('pages:wizard.travelers.occasionNone')}
          selected={occasion === null}
          onPress={() => setOccasion(null)}
        />
        {OCCASIONS.map((o) => (
          <Chip key={o} label={t(`pages:occasion.${o}`)} selected={occasion === o} onPress={() => setOccasion(o)} />
        ))}
      </View>
    </View>
  );
}

function InterestsStep({
  interests,
  toggleInterest,
  notes,
  setNotes,
}: {
  interests: string[];
  toggleInterest: (key: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.interests.title')} subtitle={t('pages:wizard.interests.subtitle')} />
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
      <AppInput
        value={notes}
        onChangeText={setNotes}
        placeholder={t('pages:wizard.interests.notesPlaceholder')}
        multiline
        containerStyle={styles.notesInput}
      />
    </View>
  );
}

function ReviewStep({
  destination,
  dateFlexibility,
  startDate,
  endDate,
  budgetTier,
  budgetAmount,
  travelers,
  occasion,
  interests,
}: {
  destination: PlaceSearchResultVM | null;
  dateFlexibility: DateFlexibility;
  startDate: string;
  endDate: string;
  budgetTier: BudgetTier;
  budgetAmount: string;
  travelers: Travelers;
  occasion: Occasion | null;
  interests: string[];
}) {
  const { t } = useTranslation();
  const travelerCount = travelers.adults + (travelers.children ?? 0) + (travelers.seniors ?? 0);
  const interestLabels = INTEREST_OPTIONS.filter((o) => interests.includes(o.key)).map((o) => o.label);

  return (
    <View style={styles.stepGap}>
      <StepHeading title={t('pages:wizard.review.title')} subtitle={t('pages:wizard.review.subtitle')} />
      <Card radius={Radii.lg}>
        <View style={styles.reviewCard}>
          <ReviewRow
            icon="location-outline"
            label={t('pages:wizard.review.destinationLabel')}
            value={destination ? `${destination.city}, ${destination.countryName}` : '—'}
          />
          <ReviewRow
            icon="calendar-outline"
            label={t('pages:wizard.review.datesLabel')}
            value={`${startDate || '—'} → ${endDate || '—'} (${t(`pages:dateFlexibility.${dateFlexibility}`)})`}
          />
          <ReviewRow
            icon="cash-outline"
            label={t('pages:wizard.review.budgetLabel')}
            value={`${t(`pages:budgetTier.${budgetTier}`)}${budgetAmount ? ` · $${budgetAmount}` : ''}`}
          />
          <ReviewRow
            icon="people-outline"
            label={t('pages:wizard.review.travelersLabel')}
            value={t('pages:trips.card.travelers', { count: travelerCount })}
          />
          <ReviewRow
            icon="sparkles-outline"
            label={t('pages:wizard.review.occasionLabel')}
            value={occasion ? t(`pages:occasion.${occasion}`) : t('pages:wizard.travelers.occasionNone')}
          />
          <ReviewRow
            icon="heart-outline"
            label={t('pages:wizard.review.interestsLabel')}
            value={interestLabels.length > 0 ? interestLabels.join(', ') : '—'}
          />
        </View>
      </Card>
    </View>
  );
}

function ReviewRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Icon name={icon} size={18} themeColor="textSecondary" />
      <View style={styles.selectedText}>
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
  resultList: { gap: Spacing.two },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.three },
  selectedText: { flex: 1, gap: 2 },
  stepperCard: { gap: Spacing.three, padding: Spacing.three },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepperLabel: { fontWeight: '600' },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  stepperBtn: { width: 32, height: 32, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { minWidth: 20, textAlign: 'center', fontWeight: '700' },
  occasionLabel: { marginTop: Spacing.one },
  notesInput: { minHeight: 80, alignItems: 'flex-start', paddingVertical: Spacing.two },
  reviewCard: { gap: Spacing.three, padding: Spacing.three },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  footer: { padding: Spacing.four, paddingTop: Spacing.two, borderTopWidth: StyleSheet.hairlineWidth },
  footerRow: { flexDirection: 'row', gap: Spacing.two },
  footerBtn: { minWidth: 96 },
  footerBtnGrow: { flex: 1 },
  center: { textAlign: 'center' },
  generating: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two, padding: Spacing.five },
  generatingSteps: { gap: Spacing.two, marginTop: Spacing.four, alignSelf: 'stretch' },
  generatingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
