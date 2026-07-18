import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import colors from '../constants/colors';
import { fontFamily } from '../constants/fonts';

// Campus vs. campus rivalry meter. Pass `data` shaped like MOCK_RIVALRY in
// data/mockFeed.js - swap that mock object for your live rivalry stats and
// the bar widths/labels/counts update automatically, no changes needed here.
export default function RivalryBar({ data }) {
  if (!data) return null;
  const { left, right, topPercentBadge } = data;

  return (
    <BlurView intensity={30} tint="dark" style={styles.container}>
      {/* "You're among Top 5% of Your Campus" badge */}
      {!!topPercentBadge && (
        <View style={styles.topBadge}>
          <View style={styles.topBadgeDot} />
          <Text style={styles.topBadgeText}>{topPercentBadge}</Text>
        </View>
      )}

      {/* Split bar - segment widths are driven by `percent` */}
      <View style={styles.barTrack}>
        <View style={[styles.barSegment, { flex: left.percent, backgroundColor: colors.rivalryRed }]}>
          <Text style={styles.barPercent}>{left.percent}%</Text>
          <Text style={styles.barLabel} numberOfLines={1}>{left.label}</Text>
        </View>
        <View style={[styles.barSegment, { flex: right.percent, backgroundColor: colors.rivalryPurple }]}>
          <Text style={styles.barPercent}>{right.percent}%</Text>
          <Text style={styles.barLabel} numberOfLines={1}>{right.label}</Text>
        </View>
      </View>

      {/* Vote counts + status, colour-matched to each side */}
      <View style={styles.countsRow}>
        <View>
          <Text style={[styles.count, { color: colors.rivalryRed }]}>{formatCount(left.count)}</Text>
          <Text style={[styles.status, { color: colors.rivalryRed }]}>{left.status}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.count, { color: colors.rivalryPurple }]}>{formatCount(right.count)}</Text>
          <Text style={[styles.status, { color: colors.rivalryPurple }]}>{right.status}</Text>
        </View>
      </View>
    </BlurView>
  );
}

function formatCount(n) {
  return n.toLocaleString('en-IN');
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassFill,
    overflow: 'hidden',
  },
  topBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  topBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.logoAccent,
  },
  topBadgeText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.text,
  },
  barTrack: {
    flexDirection: 'row',
    height: 74,
    borderRadius: 18,
    overflow: 'hidden',
  },
  barSegment: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  barPercent: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.text,
  },
  barLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.text,
    marginTop: 2,
  },
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  count: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  status: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    marginTop: 2,
  },
});
