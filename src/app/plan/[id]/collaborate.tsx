import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { AppInput } from '@/components/ui/input';
import { Radii, Spacing } from '@/constants/theme';
import { useCollaboration } from '@/hooks/data/use-collaboration';
import { usePlan } from '@/hooks/data/use-plan';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_USER } from '@/mocks/user';
import type { PlanComment, PlanVote, VoteValue } from '@/types';

/** Ortak Plan / Davet (`/plan/[id]/collaborate`) — grup seyahatlerinde birlikte planlama. */
export default function PlanCollaborateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlan(id);
  const { data } = useCollaboration(id);
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [votes, setVotes] = useState<PlanVote[]>(data.votes);
  const [comments, setComments] = useState<PlanComment[]>(data.comments);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!plan) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText type="h2">{t('pages:plan.notFound')}</ThemedText>
        <AppButton label={t('common:goBack')} variant="ghost" fullWidth={false} onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const vote = (itemId: string, value: VoteValue) => {
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
      const addingUp = value === 'up' ? 1 : 0;
      const addingDown = value === 'down' ? 1 : 0;
      return prev.map((v) =>
        v.itemId === itemId
          ? {
              ...v,
              upvotes: v.upvotes + undoingUp + addingUp,
              downvotes: v.downvotes + undoingDown + addingDown,
              myVote: v.myVote === value ? null : value,
            }
          : v,
      );
    });
  };

  const sendComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        id: `cm-local-${Date.now()}`,
        itemId: null,
        authorName: MOCK_USER.name,
        authorAvatarUrl: MOCK_USER.avatarUrl,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setCommentText('');
  };

  const copyInvite = () => {
    void Clipboard.setStringAsync(`https://tripso.app/plan/${plan.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

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

        <AppButton
          label={copied ? t('pages:collaborate.inviteCopied') : t('pages:collaborate.invite')}
          leadingIcon={copied ? 'checkmark' : 'link-outline'}
          variant="secondary"
          onPress={copyInvite}
        />

        <View style={styles.section}>
          <ThemedText type="h3">{t('pages:collaborate.collaborators')}</ThemedText>
          <View style={styles.collaboratorRow}>
            {data.collaborators.map((c) => (
              <View key={c.id} style={styles.collaborator}>
                <Avatar uri={c.avatarUrl} name={c.name} size={44} />
                <ThemedText type="caption" numberOfLines={1} style={styles.collaboratorName}>
                  {c.name}
                </ThemedText>
                <ThemedText type="caption" themeColor="textTertiary">
                  {t(`pages:collaborate.${c.role}`)}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3">{t('pages:collaborate.voting')}</ThemedText>
          <View style={styles.itemList}>
            {items.map((item) => {
              const v = votes.find((x) => x.itemId === item.id);
              return (
                <Card key={item.id} radius={Radii.lg}>
                  <View style={styles.voteRow}>
                    <ThemedText type="small" style={styles.voteTitle} numberOfLines={2}>
                      {item.title}
                    </ThemedText>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="upvote"
                      onPress={() => vote(item.id, 'up')}
                      style={styles.voteBtn}
                    >
                      <Icon name="thumbs-up" size={16} themeColor={v?.myVote === 'up' ? 'primary' : 'textTertiary'} />
                      <ThemedText type="caption" themeColor={v?.myVote === 'up' ? 'primary' : 'textTertiary'}>
                        {v?.upvotes ?? 0}
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="downvote"
                      onPress={() => vote(item.id, 'down')}
                      style={styles.voteBtn}
                    >
                      <Icon name="thumbs-down" size={16} themeColor={v?.myVote === 'down' ? 'danger' : 'textTertiary'} />
                      <ThemedText type="caption" themeColor={v?.myVote === 'down' ? 'danger' : 'textTertiary'}>
                        {v?.downvotes ?? 0}
                      </ThemedText>
                    </Pressable>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3">{t('pages:collaborate.comments')}</ThemedText>
          <View style={[styles.commentInputRow, { backgroundColor: theme.backgroundElement }]}>
            <AppInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder={t('pages:collaborate.commentPlaceholder')}
              containerStyle={styles.commentInput}
              onSubmitEditing={sendComment}
              returnKeyType="send"
            />
            <IconButton icon="send" accessibilityLabel={t('pages:collaborate.send')} themeColor="primary" onPress={sendComment} />
          </View>
          <View style={styles.commentList}>
            {comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <Avatar uri={c.authorAvatarUrl} name={c.authorName} size={32} />
                <View style={styles.commentBody}>
                  <View style={styles.commentHeader}>
                    <ThemedText type="smallBold">{c.authorName}</ThemedText>
                    {c.itemId === null && (
                      <ThemedText type="caption" themeColor="textTertiary">
                        · {t('pages:collaborate.generalComment')}
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText type="small">{c.text}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  content: { paddingHorizontal: Spacing.three, gap: Spacing.three },
  section: { gap: Spacing.two, marginTop: Spacing.two },
  collaboratorRow: { flexDirection: 'row', gap: Spacing.three, flexWrap: 'wrap' },
  collaborator: { alignItems: 'center', gap: 2, width: 72 },
  collaboratorName: { maxWidth: 72 },
  itemList: { gap: Spacing.two },
  voteRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.three },
  voteTitle: { flex: 1 },
  voteBtn: { alignItems: 'center', gap: 2 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: Radii.pill, paddingRight: Spacing.one },
  commentInput: { flex: 1, backgroundColor: 'transparent' },
  commentList: { gap: Spacing.three },
  commentRow: { flexDirection: 'row', gap: Spacing.two },
  commentBody: { flex: 1, gap: 2 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
