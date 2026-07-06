import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ReviewRow } from '@/components/wizard/review-row';
import { StepHeading } from '@/components/wizard/step-heading';
import { Card } from '@/components/ui/card';
import { Radii, Spacing } from '@/constants/theme';
import type { PlaceSearchResultVM } from '@/mocks/place-search';
import type { BudgetTier, DateFlexibility, Occasion, Travelers } from '@/types';

export type ReviewStepProps = {
  destination: PlaceSearchResultVM | null;
  dateFlexibility: DateFlexibility;
  startDate: string;
  endDate: string;
  budgetTier: BudgetTier;
  budgetAmount: string;
  travelers: Travelers;
  occasion: Occasion | null;
  interests: string[];
};

export function ReviewStep({
  destination,
  dateFlexibility,
  startDate,
  endDate,
  budgetTier,
  budgetAmount,
  travelers,
  occasion,
  interests,
}: ReviewStepProps) {
  const { t } = useTranslation();
  const travelerCount = travelers.adults + (travelers.children ?? 0) + (travelers.seniors ?? 0);
  const interestLabels = interests.map((key) => t(`pages:interests.${key}`));

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

const styles = StyleSheet.create({
  stepGap: { gap: Spacing.three },
  reviewCard: { gap: Spacing.three, padding: Spacing.three },
});
