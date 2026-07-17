import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function MessagesScreen({ navigation }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!user) return;

    // Get all messages involving me, most recent first
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, sender_id, receiver_id, content, created_at')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      setLoading(false);
      return;
    }

    // Group by "the other person" -> keep only the latest message per person
    const convoMap = new Map();
    for (const msg of messages) {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!convoMap.has(otherId)) {
        convoMap.set(otherId, msg);
      }
    }

    const otherIds = Array.from(convoMap.keys());
    if (otherIds.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Fetch profile info for each conversation partner
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', otherIds);

    if (profileError) {
      console.error('Error loading profiles:', profileError);
      setLoading(false);
      return;
    }

    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const merged = otherIds.map((id) => ({
      otherUserId: id,
      profile: profileMap.get(id),
      lastMessage: convoMap.get(id),
    }));

    // Already sorted since original query was ordered desc and we took first-seen per person
    setConversations(merged);
    setLoading(false);
  }, [user]);

  // Refresh conversation list every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadConversations();
    }, [loadConversations])
  );

  // Realtime: refresh list when any new message involving me arrives
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-list-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new;
          if (msg.sender_id === user.id || msg.receiver_id === user.id) {
            loadConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadConversations]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          otherUserId: item.otherUserId,
          otherUserName: item.profile?.username || 'Unknown',
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item.profile?.username || '?').charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.name}>{item.profile?.username || 'Unknown User'}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.lastMessage.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Messages</Text>
      {conversations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.otherUserId}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', padding: 20, paddingBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#7f8c8d', fontSize: 15 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  rowContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  preview: { fontSize: 14, color: '#7f8c8d', marginTop: 2 },
});