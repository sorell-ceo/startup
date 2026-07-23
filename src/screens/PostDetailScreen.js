import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../constants/theme';

export default function PostDetailScreen({ route, navigation }) {
  const { posts, initialIndex } = route.params;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const renderPost = ({ item }) => (
    <View style={styles.postWrap}>
      {item.media_type === 'video' ? (
        <Video
          source={{ uri: item.media_urls[0] }}
          style={styles.media}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
        />
      ) : (
        <Image source={{ uri: item.media_urls[0] }} style={styles.media} resizeMode="contain" />
      )}

      <View style={styles.metaRow}>
        {item.category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        ) : null}
        {item.location_tag ? <Text style={styles.locationTag}>{item.location_tag}</Text> : null}
      </View>

      {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.paper} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeIndex + 1} / {posts.length}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: 500,
          offset: 500 * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / 500);
          setActiveIndex(index);
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { width: 34, padding: 4 },
  headerTitle: {
    fontSize: 14,
    color: colors.paperDim,
    fontFamily: fonts.body.semiBold,
  },
  postWrap: { minHeight: 500, paddingBottom: 20 },
  media: { width: '100%', height: 420, backgroundColor: colors.ink2 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
    marginTop: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(124,92,252,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.violet,
    fontSize: 11,
    fontFamily: fonts.body.bold,
    textTransform: 'capitalize',
  },
  locationTag: {
    color: colors.paperDim,
    fontSize: 12,
    fontFamily: fonts.body.medium,
  },
  caption: {
    color: colors.paper,
    fontSize: 14,
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
    marginTop: 10,
    fontFamily: fonts.body.regular,
  },
});