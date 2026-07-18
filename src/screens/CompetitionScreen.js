// src/screens/CompetitionScreen.js
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const PERCENTILE_SCOPES = ['campus', 'all-app', 'friends'];
const SCOPE_LABELS = {
  campus: 'Your Campus',
  'all-app': 'All App Users',
  friends: 'Your Friends',
};

export default function CompetitionScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [collegeLeaderboard, setCollegeLeaderboard] = useState([]);
  const [creatorLeaderboard, setCreatorLeaderboard] = useState([]);
  const [normalLeaderboard, setNormalLeaderboard] = useState([]);

  const [myCollegeId, setMyCollegeId] = useState(null);
  const [percentileScope, setPercentileScope] = useState('campus');
  const [percentile, setPercentile] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);

    // Get my own profile info (college, account_type) first
    const { data: myProfile } = await supabase
      .from('profiles')
      .select('college_id, account_type')
      .eq('id', user.id)
      .single();

    setMyCollegeId(myProfile?.college_id || null);

    const [collegeRes, creatorRes, normalRes] = await Promise.all([
      supabase.from('v_college_leaderboard').select('*'),
      supabase.from('v_creator_leaderboard').select('*'),
      supabase.from('v_normal_leaderboard').select('*'),
    ]);

    setCollegeLeaderboard(collegeRes.data || []);
    setCreatorLeaderboard(creatorRes.data || []);
    setNormalLeaderboard(normalRes.data || []);

    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const computePercentile = useCallback(
    async (scope) => {
      setPercentile(null);

      // Combine both leaderboards to get a full picture of everyone's points
      const allUsers = [...creatorLeaderboard, ...normalLeaderboard];

      let pool = allUsers;

      if (scope === 'campus') {
        pool = allUsers.filter((u) => u.college_id === myCollegeId);
      } else if (scope === 'friends') {
        const { data: following } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        const followingIds = new Set((following || []).map((f) => f.following_id));
        pool = allUsers.filter((u) => followingIds.has(u.user_id) || u.user_id === user.id);
      }
      // 'all-app' uses the full allUsers pool as-is

      if (pool.length === 0) {
        setPercentile(null);
        return;
      }

      const sorted = [...pool].sort((a, b) => b.total_points - a.total_points);
      const myIndex = sorted.findIndex((u) => u.user_id === user.id);

      if (myIndex === -1) {
        setPercentile(null);
        return;
      }

      const percentRank = Math.round(((myIndex + 1) / sorted.length) * 100);
      setPercentile(percentRank);
    },
    [creatorLeaderboard, normalLeaderboard, myCollegeId, user]
  );

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        computePercentile(percentileScope);
      }
    }, [loading, percentileScope, computePercentile])
  );

  const renderLeaderboardRow = ({ item, index }) => {
    const isMe = item.user_id === user.id;
    return (
      <View style={[styles.row, isMe && styles.rowHighlight]}>
        <Text style={styles.rank}>#{index + 1}</Text>
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {(item.username || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.rowUsername}>@{item.username}</Text>
        <Text style={styles.rowPoints}>{item.total_points} pts</Text>
      </View>
    );
  };

  const renderCollegeRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Text style={styles.rowUsername}>{item.college_name}</Text>
      <Text style={styles.rowPoints}>{item.total_points} pts</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Competitions</Text>
        <View style={styles.center}>
          <ActivityIndicator color="#3498db" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Competitions</Text>

      <FlatList
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* Percentile pill */}
            <View style={styles.pillSection}>
              <View style={styles.scopeToggle}>
                {PERCENTILE_SCOPES.map((scope) => (
                  <TouchableOpacity
                    key={scope}
                    style={[
                      styles.scopeChip,
                      percentileScope === scope && styles.scopeChipActive,
                    ]}
                    onPress={() => setPercentileScope(scope)}
                  >
                    <Text
                      style={[
                        styles.scopeChipText,
                        percentileScope === scope && styles.scopeChipTextActive,
                      ]}
                    >
                      {SCOPE_LABELS[scope]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.pill}>
                {percentile !== null ? (
                  <Text style={styles.pillText}>
                    🏆 You're among the top {percentile}% of {SCOPE_LABELS[percentileScope]}
                  </Text>
                ) : (
                  <Text style={styles.pillTextMuted}>
                    Start earning points to see your ranking
                  </Text>
                )}
              </View>
            </View>

            {/* College leaderboard */}
            <Text style={styles.sectionTitle}>🏫 Top Colleges</Text>
            {collegeLeaderboard.length === 0 ? (
              <Text style={styles.emptyText}>No data yet</Text>
            ) : (
              collegeLeaderboard.map((item, index) => (
                <View key={item.college_name}>{renderCollegeRow({ item, index })}</View>
              ))
            )}

            {/* Creator leaderboard */}
            <Text style={styles.sectionTitle}>✨ Top Creators</Text>
            {creatorLeaderboard.length === 0 ? (
              <Text style={styles.emptyText}>No creators yet</Text>
            ) : (
              creatorLeaderboard.map((item, index) => (
                <View key={item.user_id}>{renderLeaderboardRow({ item, index })}</View>
              ))
            )}

            {/* Normal leaderboard */}
            <Text style={styles.sectionTitle}>👥 Top Users</Text>
          </>
        }
        data={normalLeaderboard}
        keyExtractor={(item) => item.user_id}
        renderItem={renderLeaderboardRow}
        ListEmptyComponent={<Text style={styles.emptyText}>No users yet</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', padding: 20, paddingBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  pillSection: { paddingHorizontal: 16, marginBottom: 20 },
  scopeToggle: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  scopeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  scopeChipActive: { backgroundColor: '#3498db' },
  scopeChipText: { fontSize: 12, fontWeight: '600', color: '#7f8c8d' },
  scopeChipTextActive: { color: '#fff' },
  pill: {
    backgroundColor: '#eaf4fc',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pillText: { color: '#2c3e50', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  pillTextMuted: { color: '#7f8c8d', fontSize: 13, textAlign: 'center' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: { color: '#7f8c8d', fontSize: 13, paddingHorizontal: 16, marginBottom: 10 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  rowHighlight: { backgroundColor: '#eaf4fc' },
  rank: { width: 28, fontSize: 13, fontWeight: '700', color: '#7f8c8d' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  rowUsername: { flex: 1, fontSize: 14, fontWeight: '600', color: '#2c3e50' },
  rowPoints: { fontSize: 13, fontWeight: '700', color: '#3498db' },
});