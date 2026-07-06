import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BudgetStep } from '@/components/trip-wizard/budget-step';
import { STEP_COUNT } from '@/components/trip-wizard/constants';
import { DatesStep } from '@/components/trip-wizard/dates-step';
import { DestinationStep } from '@/components/trip-wizard/destination-step';
import { GeneratingView } from '@/components/trip-wizard/generating-view';
import { InterestsStep } from '@/components/trip-wizard/interests-step';
import { ReviewStep } from '@/components/trip-wizard/review-step';
import { TravelersStep } from '@/components/trip-wizard/travelers-step';
import { WizardFrame } from '@/components/wizard/wizard-frame';
import { usePlaceSearch } from '@/hooks/data/use-place-search';
import { createTrip } from '@/mocks/trip-draft-store';
import type { PlaceSearchResultVM } from '@/mocks/place-search';
import type { BudgetTier, DateFlexibility, Occasion, Travelers } from '@/types';

/**
 * New Trip (`/trip/new`) — Trip Sihirbazı (modal).
 *
 * 6 adım: destinasyon (autocomplete, serbest metin yok) → tarihler → bütçe →
 * yolcular + occasion → ilgi alanları → özet. Son adımda sahte AI üretim
 * ekranına geçer, `trip-draft-store`'a Trip yazar ve `/plan/[id]`'e yönlendirir.
 * Adım içerikleri `src/components/trip-wizard/` altında; iskelet `WizardFrame`.
 */
export default function NewTripScreen() {
  const { city, country } = useLocalSearchParams<{ city?: string; country?: string }>();
  const { t } = useTranslation();

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

  const canProceed =
    step === 0
      ? destination != null
      : step === 1
        ? startDate.trim().length > 0 && endDate.trim().length > 0
        : true;

  const goNext = () => {
    if (step < STEP_COUNT - 1) setStep((s) => s + 1);
    else setPhase('generating');
  };
  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  };

  if (phase === 'generating') {
    return <GeneratingView city={destination?.city ?? ''} activeStep={generatingStep} />;
  }

  return (
    <WizardFrame
      title={t('pages:wizard.title')}
      stepText={t('pages:wizard.step', { current: step + 1, total: STEP_COUNT })}
      progress={(step + 1) / STEP_COUNT}
      backLabel={t('pages:wizard.back')}
      nextLabel={step === STEP_COUNT - 1 ? t('pages:wizard.create') : t('pages:wizard.next')}
      nextIcon={step === STEP_COUNT - 1 ? 'sparkles' : 'chevron-forward'}
      nextDisabled={!canProceed}
      closeLabel={t('common:close')}
      onClose={() => router.back()}
      onBack={goBack}
      onNext={goNext}
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
        <InterestsStep interests={interests} toggleInterest={toggleInterest} notes={notes} setNotes={setNotes} />
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
    </WizardFrame>
  );
}
