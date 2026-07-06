import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ReviewRow } from '@/components/wizard/review-row';
import { StepHeading } from '@/components/wizard/step-heading';
import { Card } from '@/components/ui/card';
import { Radii, Spacing } from '@/constants/theme';
import type { AccommodationTier, Alcohol, Pace } from '@/types';

export type ReviewStepProps = {
  name: string;
  ageGroup: string;
  alcohol: Alcohol;
  dietary: string[];
  pace: Pace;
  accommodation: AccommodationTier;
  interests: string[];
};

export function ReviewStep({
  name,
  ageGroup,
  alcohol,
  dietary,
  pace,
  accommodation,
  interests,
}: ReviewStepProps) {
  const { t } = useTranslation();
  const interestLabels = interests.map((key) => t(`pages:interests.${key}`));

  return (
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
