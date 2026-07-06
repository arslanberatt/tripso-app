import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Radii, Spacing } from '@/constants/theme';
import type { PlanVote, VoteValue } from '@/types';

/** VoteCard — tek durak için beğen/beğenme oylaması. */
export type VoteCardProps = {
  title: string;
  vote: PlanVote | undefined;
  onVote: (value: Exclude<VoteValue, null>) => void;
};

export function VoteCard({ title, vote, onVote }: VoteCardProps) {
  return (
    <Card radius={Radii.lg}>
      <View style={styles.row}>
        <ThemedText type="small" style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>
        <Pressable accessibilityRole="button" accessibilityLabel="upvote" onPress={() => onVote('up')} style={styles.button}>
          <Icon name="thumbs-up" size={16} themeColor={vote?.myVote === 'up' ? 'primary' : 'textTertiary'} />
          <ThemedText type="caption" themeColor={vote?.myVote === 'up' ? 'primary' : 'textTertiary'}>
            {vote?.upvotes ?? 0}
          </ThemedText>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="downvote" onPress={() => onVote('down')} style={styles.button}>
          <Icon name="thumbs-down" size={16} themeColor={vote?.myVote === 'down' ? 'danger' : 'textTertiary'} />
          <ThemedText type="caption" themeColor={vote?.myVote === 'down' ? 'danger' : 'textTertiary'}>
            {vote?.downvotes ?? 0}
          </ThemedText>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.three },
  title: { flex: 1 },
  button: { alignItems: 'center', gap: 2 },
});
