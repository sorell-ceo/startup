// app/signup.tsx
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

// Hardcoded for testing — swap/extend for real launch domains
const ALLOWED_DOMAIN = '@nitkkr.ac.in';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (value: string) => {
    return value.toLowerCase().endsWith(ALLOWED_DOMAIN);
  };

  const handleContinue = () => {
    if (!email.includes('@')) {
      setError('Enter a valid email');
      return;
    }
    if (!isValidEmail(email)) {
      setError(`Only ${ALLOWED_DOMAIN} emails allowed`);
      return;
    }
    setError('');
    // TODO: trigger OTP send API here
    router.push({ pathname: '/verify-otp', params: { email } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[Typography.h2, styles.title]}>Let's Create Your Account</Text>
        <Text style={[Typography.body, styles.subtitle]}>
          Use your college email — verification keeps this space real.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="you@college.ac.in"
          placeholderTextColor={Colors.textMuted}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={handleContinue} style={styles.button} activeOpacity={0.85}>
          <Text style={Typography.button}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: Colors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    marginBottom: 8,
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