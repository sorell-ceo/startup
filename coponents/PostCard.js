import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontFamily } from '../constants/fonts';
import IconButton from './IconButton';
import { tapHaptic } from '../utils/haptics';

// One feed post - works for both regular posts and promoted/ad posts
// (pass `promoted: true` on the post object - see data/mockFeed.js).
export default function PostCard({ post }) {
  const { user, location, date, media, caption, stats, promoted } = post;

  const handleMenuPress = () => tapHaptic();

  return (
    <View style={styles.container}>
      {/* Header: avatar, name + verified badge, location + date, menu */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>{renderAvatar(user.avatar)}</View>

        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
            {/* TODO: swap for your offline verified-badge icon */}
            {user.verified && <View style={styles.verifiedDot} />}
          </View>
          <View style={styles.metaRow}>
            {/* TODO: swap for your offline location-pin icon */}
            <View style={styles.pinPlaceholder} />
            <Text style={styles.metaText} numberOfLines={1}>{location}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{date}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleMenuPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Media placeholder - drop a real image/video uri from the backend into `media` */}
      <View style={styles.mediaWrapper}>
        {media ? (
          <Image source={{ uri: media }} style={styles.media} resizeMode="cover" />
        ) : (
          <View style={styles.mediaPlaceholder} />
        )}
        {promoted && (
          <View style={styles.promotedTag}>
            <Text style={styles.promotedText}>PROMOTED</Text>
          </View>
        )}
      </View>

      {/* Engagement row - like / comment / share / save */}
      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <Action count={stats.likes} />
          <Action count={stats.comments} />
          <Action count={stats.shares} />
        </View>
        <Action count={stats.saves} />
      </View>

      {/* Caption */}
      <Text style={styles.caption} numberOfLines={2}>
        <Text style={styles.captionUser}>{user.handle}  </Text>
        {caption}
      </Text>
    </View>
  );
}

function renderAvatar(avatar) {
  if (avatar) return <Image source={{ uri: avatar }} style={styles.avatar} />;
  return <View style={styles.avatarPlaceholder} />;
}

function formatStat(n) {
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
}

function Action({ count }) {
  return (
    <View style={styles.action}>
      {/* TODO: swap icon={null} for your offline heart/comment/share/bookmark icon */}
      <IconButton icon={null} size={20} />
      <Text style={styles.actionCount}>{formatStat(count)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  avatarWrapper: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  verifiedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.verifiedBadge,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 5,
  },
  pinPlaceholder: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  metaText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  metaDot: {
    color: colors.textMuted,
    fontSize: 11,
  },
  menuDots: {
    color: colors.textMuted,
    fontSize: 18,
    fontFamily: fontFamily.bold,
    paddingHorizontal: 4,
  },
  mediaWrapper: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
  promotedTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.rivalryRed,
  },
  promotedText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.text,
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  actionsLeft: {
    flexDirection: 'row',
    gap: 18,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  caption: {
    paddingHorizontal: 16,
    marginTop: 8,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  captionUser: {
    fontFamily: fontFamily.semiBold,
  },
});
