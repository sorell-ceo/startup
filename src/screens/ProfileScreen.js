import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, full_name, bio, avatar_url, link, screenshot_protection_global')
      .eq('id', user.id)
      .single();

    if (!error) setProfile(data);
    setLoading(false);
  }, [user]);

  // Reload every time screen comes into focus (so edits show up immediately)
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const toggleGlobalProtection = async (value) => {
    setProfile((prev) => ({ ...prev, screenshot_protection_global: value }));
    const { error } = await supabase
      .from('profiles')
      .update({ screenshot_protection_global: value })
      .eq('id', user.id);
    if (error) {
      console.error('Failed to update screenshot protection:', error);
    }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Profile</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="create-outline" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {(profile.username || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.fullName}>{profile.full_name || 'Add your name'}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
          {profile.link ? (
            <Text style={styles.link}>{profile.link}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingLabel}>Screenshot Protection</Text>
          <Text style={styles.settingSubtext}>Block everyone from screenshotting your chats</Text>
        </View>
        <Switch value={profile.screenshot_protection_global} onValueChange={toggleGlobalProtection} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

import { Switch } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  profileRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  avatarWrapper: { marginRight: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: 34, fontWeight: 'bold' },
  infoCol: { flex: 1, justifyContent: 'center' },
  fullName: { fontSize: 18, fontWeight: '700', color: '#2c3e50' },
  username: { fontSize: 14, color: '#7f8c8d', marginTop: 2 },
  bio: { fontSize: 14, color: '#2c3e50', marginTop: 8, lineHeight: 19 },
  link: { fontSize: 14, color: '#3498db', marginTop: 6 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  settingSubtext: { fontSize: 13, color: '#7f8c8d', marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});