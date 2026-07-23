import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadialGlow from '../constants/RadialGlow';
import { colors, fonts, monoStyle, radii, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const { width } = Dimensions.get('window');
const GRID_GAP = 2;
const GRID_ITEM_SIZE = (width - GRID_GAP * 2) / 3;

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfileAndPosts = useCallback(async () => {
    const [{ data: profileData, error: profileError }, { data: postsData, error: postsError }] =
      await Promise.all([
        supabase
          .from('profiles')
          .select('username, full_name, bio, avatar_url, link')
          .eq('id', user.id)
          .single(),
        supabase
          .from('posts')
          .select('id, media_urls, media_type, caption, category, location_tag, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

    if (profileError) {
      console.error('Failed to load profile:', profileError.message);
    } else {
      setProfile(profileData);
    }

    if (postsError) {
      console.error('Failed to load posts:', postsError.message);
      setPosts([]);
    } else {
      setPosts(postsData || []);
    }

    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadProfileAndPosts();
    }, [loadProfileAndPosts])
  );

  const openPost = (post, index) => {
    // Pass the full list + index so a PostDetail screen can support
    // swiping between this user's other posts too.
    navigation.navigate('PostDetail', { posts, initialIndex: index });
  };

  const renderPostThumb = ({ item, index }) => (
    <TouchableOpacity
      style={styles.gridItem}
      activeOpacity={0.85}
      onPress={() => openPost(item, index)}
    >
      <Image source={{ uri: item.media_urls[0] }} style={styles.gridImage} />
      {item.media_type === 'video' && (
        <View style={styles.videoBadge}>
          <Ionicons name="play" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.headerTitleOnly}>Profile</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.headerTitleOnly}>Profile</Text>
        <View style={{ padding: spacing.lg }}>
          <Text style={{ color: colors.coral, fontFamily: fonts.body.medium }}>
            Couldn't load your profile. Check the console for the Supabase error, or pull
            down to try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitleOnly}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.iconBtn}>
            <Ionicons name="create-outline" size={22} color={colors.violet} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color={colors.paper} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderPostThumb}
        columnWrapperStyle={{ gap: GRID_GAP }}
        contentContainerStyle={{ gap: GRID_GAP, paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* ---------- Student ID Card ---------- */}
            <View style={styles.idCardWrap}>
              <View style={styles.idCard}>
                <RadialGlow
                  color={colors.violet}
                  size={260}
                  opacity={0.35}
                  style={{ top: -60, left: -30 }}
                />

                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={11} color={colors.ink} />
                  <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                </View>

                <View style={styles.idTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.idBrand}>UNIVERCE ID</Text>
                    <Text style={styles.idName}>{profile.full_name || profile.username}</Text>
                    <Text style={styles.idSub}>@{profile.username}</Text>
                  </View>

                  {profile.avatar_url ? (
                    <Image source={{ uri: profile.avatar_url }} style={styles.idPhoto} />
                  ) : (
                    <View style={[styles.idPhoto, styles.idPhotoPlaceholder]}>
                      <Text style={styles.idPhotoInitial}>
                        {(profile.username || '?').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.idBottomRow}>
                  <View style={styles.idBarcode}>
                    {[12, 20, 8, 16, 10, 18, 14, 9, 19, 11].map((h, i) => (
                      <View key={i} style={[styles.barLine, { height: h }]} />
                    ))}
                  </View>
                  <Text style={styles.idHandle}>UNIVERCE</Text>
                </View>
              </View>
            </View>

            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            {profile.link ? <Text style={styles.link}>{profile.link}</Text> : null}

            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>{posts.length} posts</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyPosts}>
            <Ionicons name="images-outline" size={32} color={colors.paperDim} />
            <Text style={styles.emptyPostsText}>No posts yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101014' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
  },
  headerTitleOnly: {
    fontSize: 20,
    color: colors.paper,
    fontFamily: fonts.display.bold,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 2 },

  // ---------- ID card ----------
  idCardWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: 18,
    alignItems: 'center',
  },
  idCard: {
    width: '100%',
    aspectRatio: 1.586,
    borderRadius: radii.xl,
    backgroundColor: colors.ink2,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: colors.mint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    transform: [{ rotate: '8deg' }],
    zIndex: 10,
  },
  verifiedBadgeText: {
    color: colors.ink,
    fontSize: 10,
    ...monoStyle,
    letterSpacing: 0.4,
  },
  idTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  idBrand: {
    color: colors.mint,
    fontSize: 10,
    marginBottom: 10,
    ...monoStyle,
  },
  idName: {
    color: colors.paper,
    fontSize: 18,
    fontFamily: fonts.display.bold,
  },
  idSub: {
    color: colors.paperDim,
    fontSize: 11,
    fontFamily: fonts.body.medium,
    marginTop: 4,
  },
  idPhoto: { width: 68, height: 68, borderRadius: 36, marginLeft: 12 },
  idPhotoPlaceholder: {
    backgroundColor: colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idPhotoInitial: { color: '#f8f7f7', fontSize: 20, fontFamily: fonts.display.bold },
  idBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  idBarcode: { flexDirection: 'row', gap: 2, alignItems: 'flex-end', height: 20 },
  barLine: { width: 2, backgroundColor: 'rgba(245,243,255,0.35)' },
  idHandle: {
    color: colors.paperDim,
    fontSize: 10,
    ...monoStyle,
  },

  bio: {
    fontFamily:'Manrope_Bold',
    fontSize: 14,
    color: colors.paper,
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: spacing.lg,
    lineHeight: 19,
  },
  link: {
    fontSize: 14,
    color: colors.mint,
    paddingHorizontal: spacing.lg,
    marginBottom: 12,
    fontFamily: fonts.body.medium,
  },
  statsRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: 14,
  },
  statsLabel: {
    fontSize: 13,
    color: colors.paperDim,
    fontFamily: fonts.body.semiBold,
  },

  // ---------- posts grid ----------
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    backgroundColor: colors.ink2,
  },
  gridImage: { width: '100%', height: '100%' },
  videoBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 4,
  },
  emptyPosts: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyPostsText: {
    color: colors.paperDim,
    fontSize: 14,
    fontFamily: fonts.body.medium,
  },
});