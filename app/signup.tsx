// app/signup.tsx
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleContinue = () => {
    if (!email.includes('@')) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    router.push({ pathname: './verify-otp', params: { email } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={() => inputRef.current?.blur()}>
        <View style={styles.content}>
          <Text style={[Typography.h2, styles.title]}>Let's Create Your Account</Text>
          <Text style={[Typography.impBody, styles.subtitle]}>
            Enter your College Email ID
          </Text>

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              { borderColor: isFocused ? Colors.gradientStart : Colors.textPrimary }
            ]}
            placeholder="you@college.ac.in"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity onPress={handleContinue} style={styles.button} activeOpacity={0.85}>
            <Text style={Typography.button}>Continue</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  title: {
    marginBottom: 8,
    marginTop: 30,
    paddingHorizontal: 0,
    paddingVertical: 20,
  },
  subtitle: {
    marginBottom: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 30,
    marginLeft: 0,
    letterSpacing: -0.5,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: Colors.textPrimary,
    fontFamily: 'Barlow_400Regular',
    fontSize: 16,
    marginBottom: 50,
  },
  errorText: {
    color: '#FF5C5C',
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    marginTop: -44,
    marginBottom: 30,
    marginLeft: 16,
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});