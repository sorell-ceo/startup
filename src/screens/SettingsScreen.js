import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function SettingsScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [screenshotProtection, setScreenshotProtection] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('screenshot_protection_global')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setScreenshotProtection(data.screenshot_protection_global);
    }
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  const toggleGlobalProtection = async (value) => {
    setScreenshotProtection(value); // optimistic
    const { error } = await supabase
      .from('profiles')
      .update({ screenshot_protection_global: value })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to update screenshot protection:', error);
      setScreenshotProtection(!value); // revert
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={styles.sectionLabel}>PRIVACY</Text>

      <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingLabel}>Screenshot Protection</Text>
          <Text style={styles.settingSubtext}>Block everyone from screenshotting your chats</Text>
        </View>
        <Switch
          value={screenshotProtection}
          onValueChange={toggleGlobalProtection}
          disabled={loading}
        />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { width: 34, padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#2c3e50' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#95a5a6',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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