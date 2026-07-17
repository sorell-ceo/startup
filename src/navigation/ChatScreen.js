import { Ionicons } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function ChatScreen({ route, navigation }) {
  const { otherUserId, otherUserName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [protectionActive, setProtectionActive] = useState(false);
  const [screenBlurred, setScreenBlurred] = useState(false);
  const flatListRef = useRef(null);

  // ----- Load existing messages between me and otherUserId -----
  const loadMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }
    setMessages(data);
  }, [user, otherUserId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);
  // Add near other useState declarations
const [perChatBlock, setPerChatBlock] = useState(false);

// Add this function
const togglePerChatProtection = async () => {
  const newValue = !perChatBlock;
  setPerChatBlock(newValue); // optimistic

  const { error } = await supabase
    .from('chat_privacy_settings')
    .upsert(
      {
        user_id: user.id,
        target_user_id: otherUserId,
        block_screenshots: newValue,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,target_user_id' }
    );

  if (error) {
    console.error('Failed to update per-chat protection:', error);
    setPerChatBlock(!newValue); // revert
  }
};

// Load existing per-chat setting on mount (add to your existing useEffect or a new one)
useEffect(() => {
  const loadPerChatSetting = async () => {
    const { data } = await supabase
      .from('chat_privacy_settings')
      .select('block_screenshots')
      .eq('user_id', user.id)
      .eq('target_user_id', otherUserId)
      .maybeSingle();

    setPerChatBlock(data?.block_screenshots || false);
  };
  loadPerChatSetting();
}, [user, otherUserId]);

  // ----- Realtime subscription for this specific conversation -----
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${user.id}-${otherUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new;
          const belongsToThisChat =
            (msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === user.id);

          if (belongsToThisChat) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, otherUserId]);

  // ----- Screenshot protection setup -----
  useEffect(() => {
    let isMounted = true;

    const checkProtection = async () => {
      // Rule 1: Global protection on the OTHER user's profile
      const { data: otherProfile } = await supabase
        .from('profiles')
        .select('screenshot_protection_global')
        .eq('id', otherUserId)
        .single();

      let shouldProtect = otherProfile?.screenshot_protection_global === true;

      // Rule 2: Per-profile override — did the other user block ME specifically?
      if (!shouldProtect) {
        const { data: privacySetting } = await supabase
          .from('chat_privacy_settings')
          .select('block_screenshots')
          .eq('user_id', otherUserId)
          .eq('target_user_id', user.id)
          .maybeSingle();

        shouldProtect = privacySetting?.block_screenshots === true;
      }

      if (!isMounted) return;
      setProtectionActive(shouldProtect);

      if (shouldProtect && Platform.OS === 'android') {
        // Physically blocks screenshots/recording on Android
        await ScreenCapture.preventScreenCaptureAsync();
      }
    };

    checkProtection();

    return () => {
      isMounted = false;
      if (Platform.OS === 'android') {
        ScreenCapture.allowScreenCaptureAsync();
      }
    };
  }, [user, otherUserId]);

  // ----- iOS: detect screenshot attempts (can't block, only detect) -----
  useEffect(() => {
    if (Platform.OS !== 'ios' || !protectionActive) return;

    const subscription = ScreenCapture.addScreenshotListener(async () => {
      // Blur the chat immediately
      setScreenBlurred(true);
      setTimeout(() => setScreenBlurred(false), 2000);

      // Log the attempt
      await supabase.from('screenshot_attempts').insert({
        protector_user_id: otherUserId,
        violator_user_id: user.id,
      });

      // TODO: trigger a push notification to otherUserId here (via Edge Function)
    });

    return () => {
      subscription.remove();
    };
  }, [protectionActive, user, otherUserId]);

  // ----- Send message -----
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: otherUserId,
      content: trimmed,
    });

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isMine = item.sender_id === user.id;
    return (
      <View
        style={[
          styles.bubble,
          isMine ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text style={isMine ? styles.myText : styles.theirText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
    <Ionicons name="chevron-back" size={26} color="#2c3e50" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{otherUserName}</Text>
  {protectionActive && (
    <Ionicons name="lock-closed" size={18} color="#e74c3c" style={{ marginLeft: 8 }} />
  )}
</View>

      {screenBlurred ? (
        <View style={styles.blurOverlay}>
          <Ionicons name="eye-off" size={40} color="#fff" />
          <Text style={styles.blurText}>Screenshot blocked</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginLeft: 6 },
  messagesList: { padding: 16 },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  myBubble: {
    backgroundColor: '#3498db',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  myText: { color: '#fff', fontSize: 15 },
  theirText: { color: '#2c3e50', fontSize: 15 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#3498db',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurText: { color: '#fff', marginTop: 10, fontSize: 16 },
  
  lockBtn: { padding: 8 },
});