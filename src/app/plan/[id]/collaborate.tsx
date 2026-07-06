import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CollaboratorList } from '@/components/collaborate/collaborator-list';
import { CommentSection } from '@/components/collaborate/comment-section';
import { InviteButton } from '@/components/collaborate/invite-button';
import { VoteCard } from '@/components/collaborate/vote-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { IconButton } from '@/components/ui/icon-button';
import { Spacing } from '@/constants/theme';
import { useCollaboration } from '@/hooks/data/use-collaboration';
import { usePlan } from '@/hooks/data/use-plan';
import { MOCK_USER } from '@/mocks/user';
import type { PlanComment, PlanVote, VoteValue } from '@/types';

/** Ortak Plan / Davet (`/plan/[id]/collaborate`) — davet, oylama, yorumlar. */
export default function PlanCollaborateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlan(id);
  const { data } = useCollaboration(id);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [votes, setVotes] = useState<PlanVote[]>(data.votes);
  const [comments, setComments] = useState<PlanComment[]>(data.comments);

  if (!plan) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText type="h2">{t('pages:plan.notFound')}</ThemedText>
        <AppButton label={t('common:goBack')} variant="ghost" fullWidth={false} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const vote = (itemId: string, value: Exclude<VoteValue, null>) => {
    setVotes((prev) => {
      const existing = prev.find((v) => v.itemId === itemId);
      if (!existing) {
        return [
          ...prev,
          { itemId, upvotes: value === 'up' ? 1 : 0, downvotes: value === 'down' ? 1 : 0, myVote: value },
        ];
      }
      const undoingUp = existing.myVote === 'up' ? -1 : 0;
      const undoingDown = existing.myVote === 'down' ? -1 : 0;
      return prev.map((v) =>
        v.itemId === itemId
          ? {
              ...v,
              upvotes: v.upvotes + undoingUp + (value === 'up' ? 1 : 0),
              downvotes: v.downvotes + undoingDown + (value === 'down' ? 1 : 0),
              myVote: v.myVote === value ? null : value,
            }
          : v,
      );
    });
  };

  const sendComment = (text: string) =>
    setComments((prev) => [
      {
        id: `cm-local-${Date.now()}`,
        itemId: null,
        authorName: MOCK_USER.name,
        authorAvatarUrl: MOCK_USER.avatarUrl,
        text,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

  const items = plan.days.flatMap((d) => d.items);

  return (
    <ThemedView style={styles.fill}>
      <Header
        title={t('pages:collaborate.title')}
        leading={
          <IconButton icon="chevron-back" accessibilityLabel={t('common:a11y.goBack')} onPress={() => router.back()} />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
      >
        <ThemedText type="small" themeColor="textSecondary">
          {t('pages:collaborate.subtitle')}
        </ThemedText>

        <InviteButton planId={plan.id} />
        <CollaboratorList collaborators={data.collaborators} />

        <View style={styles.section}>
          <ThemedText type="h3">{t('pages:collaborate.voting')}</ThemedText>
          <View style={styles.voteList}>
            {items.map((item) => (
              <VoteCard
                key={item.id}
                title={item.title}
                vote={votes.find((v) => v.itemId === item.id)}
                onVote={(value) => vote(item.id, value)}
              />
            ))}
          </View>
        </View>

        <CommentSection comments={comments} onSend={sendComment} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.three },
  section: { gap: Spacing.two },
  voteList: { gap: Spacing.two },
});
