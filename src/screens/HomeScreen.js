// HomeScreen.js

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommentsSheet from '../components/CommentsSheet';
import { PostCardSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const CATEGORIES = ['all', 'club', 'event', 'hostel', 'study', 'campus'];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [commentsVisible, setCommentsVisible] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

  const loadPosts = useCallback(async (category) => {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: postsData, error } = await query;

    if (error) {
      console.error('Error loading posts:', error);
      setLoading(false);
      return;
    }

    if (postsData.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }

    // Fetch poster profiles
    const userIds = [...new Set(postsData.map((p) => p.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    // Fetch like counts + whether I liked each post
    const postIds = postsData.map((p) => p.id);
    const { data: likes } = await supabase
      .from('likes')
      .select('post_id, user_id')
      .in('post_id', postIds);

    const likeCountMap = new Map();
    const myLikedSet = new Set();
    (likes || []).forEach((l) => {
      likeCountMap.set(l.post_id, (likeCountMap.get(l.post_id) || 0) + 1);
      if (l.user_id === user.id) myLikedSet.add(l.post_id);
    });
    const { data: comments } = await supabase
      .from('comments')
      .select('post_id')
      .in('post_id', postIds);

    const commentCountMap = new Map();
    (comments || []).forEach((c) => {
      commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) || 0) + 1);
    });

    const merged = postsData.map((post) => ({
      ...post,
      profile: profileMap.get(post.user_id),
      likeCount: likeCountMap.get(post.id) || 0,
      likedByMe: myLikedSet.has(post.id),
      commentCount: commentCountMap.get(post.id) || 0,
    }));

    setPosts(merged);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadPosts(activeCategory);
    }, [activeCategory, loadPosts])
  );

  const toggleLike = async (post) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    );

    if (post.likedByMe) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
    } else {
      await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
    }
  };

  const openComments = (postId) => {
    setActivePostId(postId);
    setCommentsVisible(true);
  };

  const closeComments = () => {
    setCommentsVisible(false);
    setActivePostId(null);
  };

  const handleCommentPosted = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
      )
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarSmallText}>
            {(item.profile?.username || '?').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>@{item.profile?.username || 'unknown'}</Text>
          {item.location_tag ? (
            <Text style={styles.locationTag}>{item.location_tag}</Text>
          ) : null}
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.mediaWrapper}>
        {item.media_type === 'video' ? (
          <Video
            source={{ uri: item.media_urls[0] }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            useNativeControls
          />
        ) : (
          <Image source={{ uri: item.media_urls[0] }} style={styles.media} />
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(item)}>
          <Ionicons
            name={item.likedByMe ? 'heart' : 'heart-outline'}
            size={24}
            color={item.likedByMe ? '#e74c3c' : '#F7F7F7'}
          />
          <Text style={styles.actionText}>{item.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => openComments(item.id)}>
          <Ionicons name="chatbubble-outline" size={22} color="#F7F7F7" />
          <Text style={styles.actionText}>{item.commentCount}</Text>
        </TouchableOpacity>
      </View>

      {item.caption ? (
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>@{item.profile?.username} </Text>
          {item.caption}
        </Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>univerce</Text>
      </View>

      <View style={styles.chipRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, activeCategory === item && styles.chipActive]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={{ paddingTop: 10 }}>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No posts yet in this category</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.getParent()?.navigate('CreatePost')}
      >
        <Ionicons name="add" size={30} color="#0A0A0F" />
      </TouchableOpacity>
      <CommentsSheet
        visible={commentsVisible}
        postId={activePostId}
        onClose={closeComments}
        onCommentPosted={handleCommentPosted}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101014' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C22',
  },
  logo: {
    fontFamily: 'Gloock-Regular',
    fontSize: 24,
    color: '#e6e6e6',
    letterSpacing:-0.2,
  },
  chipRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C22',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#222227',
    marginRight: 8,
    borderWidth: 0.8,
    borderColor: 'rgba(241, 242, 248, 0.14)',
  },
  chipActive: { backgroundColor: '#3ADBB8', borderColor: '#3ADBB8' },
  chipText: {
    fontFamily: 'StackSansHeadline_600SemiBold',
    color: '#B8B4CC',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  chipTextActive: { color: '#0A0A0F' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontFamily: 'Manrope-Regular', color: '#7f7f8a', fontSize: 15 },
  card: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C22',
    paddingBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3ADBB8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarSmallText: {
    fontFamily: 'Manrope-Bold',
    color: '#0A0A0F',
    fontSize: 14,
  },
  username: {
    fontFamily: 'Manrope-SemiBold',
    color: '#F7F7F7',
    fontSize: 14,
  },
  locationTag: {
    fontFamily: 'Manrope-Regular',
    color: '#7f7f8a',
    fontSize: 11,
    marginTop: 1,
  },
  categoryBadge: {
    backgroundColor: 'rgba(58, 219, 184, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'StackSansHeadline_600SemiBold',
    color: '#3ADBB8',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  mediaWrapper: { width: '100%', height: 400, backgroundColor: '#111118' },
  media: { width: '100%', height: '100%' },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    color: '#F7F7F7',
  },
  caption: {
    fontFamily: 'Manrope-Regular',
    paddingHorizontal: 16,
    marginTop: 8,
    fontSize: 14,
    color: '#D6D4E0',
    lineHeight: 19,
  },
  captionUsername: { fontFamily: 'Manrope-SemiBold', letterSpacing:-0.4,},
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3ADBB8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});