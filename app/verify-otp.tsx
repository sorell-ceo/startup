// app/verify-otp.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setError('');
    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    router.push('./setup-profile');
  };

  const handleResend = async () => {
    setError('');
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[Typography.h2, styles.title]}>Verify Your Email</Text>
        <Text style={[Typography.body, styles.subtitle]}>
          Code sent to {email}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="000000"
          placeholderTextColor={Colors.textMuted}
          value={otp}
          onChangeText={(text) => {
            setOtp(text.replace(/[^0-9]/g, ''));
            if (error) setError('');
          }}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleVerify}
          style={[styles.button, loading && { opacity: 0.6 }]}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Text style={Typography.button}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} style={{ marginTop: 20 }}>
          <Text style={[Typography.caption, { color: Colors.gradientStart }]}>
            Resend code
          </Text>
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
    marginBottom: 8,
    letterSpacing: 8,
    textAlign: 'center',
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