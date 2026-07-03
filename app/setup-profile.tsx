// app/setup-profile.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { supabase } from '../lib/supabase';

export default function SetupProfile() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);

    // Set password on the verified auth user
    const { data: userData, error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setLoading(false);
      setError(updateError.message);
      return;
    }

    // Create profile row — assumes a `profiles` table with (id uuid, username text unique)
    const userId = userData.user?.id;
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      username: username.trim(),
    });

    setLoading(false);

    if (profileError) {
      setError(
        profileError.code === '23505' ? 'Username already taken' : profileError.message
      );
      return;
    }

    router.replace('../screens/main');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[Typography.h2, styles.title]}>Pick Your Identity</Text>
        <Text style={[Typography.body, styles.subtitle]}>
          Your username is public. Your real name never shows.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={Colors.textMuted}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (error) setError('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textMuted}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError('');
          }}
          secureTextEntry
          editable={!loading}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, loading && { opacity: 0.6 }]}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={Typography.button}>{loading ? 'Saving...' : 'Enter YappOut'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { marginBottom: 12 },
  subtitle: { marginBottom: 32 },
  input: {
    backgroundColor: Colors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  errorText: {
    color: '#FF5C5C',
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});