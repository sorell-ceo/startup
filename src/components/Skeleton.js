// src/components/Skeleton.js
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// A single shimmering block — building block for all skeleton layouts
export function SkeletonBlock({ width, height, borderRadius = 6, style }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

// Mimics the shape of a HomeScreen post card
export function PostCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SkeletonBlock width={36} height={36} borderRadius={18} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <SkeletonBlock width={100} height={12} style={{ marginBottom: 6 }} />
          <SkeletonBlock width={60} height={9} />
        </View>
        <SkeletonBlock width={50} height={20} borderRadius={12} />
      </View>

      <SkeletonBlock width="100%" height={400} borderRadius={0} />

      <View style={styles.actionsRow}>
        <SkeletonBlock width={40} height={18} />
        <SkeletonBlock width={40} height={18} />
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
        <SkeletonBlock width="80%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: '#e1e5e8' },
  card: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', paddingBottom: 14 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, gap: 20 },
});