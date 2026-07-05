// app/signup.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Floating label animation
  const labelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || email.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, email]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 8],
  });

  const labelLeft = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textMuted, Colors.gradientStart],
  });

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
          <Text style={[Typography.h2, styles.title]}>
            Let's Create Your Account
          </Text>
          <Text style={[Typography.h3, styles.additionalText]}>
            Kindly enter <Text style={styles.highlight}>Only College Email ID</Text>. As it helps us verify your identity
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.inputContainer,
              { borderColor: isFocused ? Colors.gradientStart : Colors.textPrimary },
            ]}
            onPress={() => inputRef.current?.focus()}
          >
            <Animated.Text
              style={[
                styles.floatingLabel,
                {
                  top: labelTop,
                  fontSize: labelFontSize,
                  color: labelColor,
                  left: labelLeft,
                },
              ]}
            >
              Enter your email ID
            </Animated.Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
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
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            onPress={handleContinue}
            style={styles.button}
            activeOpacity={0.85}
          >
            <Text style={Typography.button}>Continue</Text>
          </TouchableOpacity>

          {/* ---------- UPDATED LOGIN ROW (inside content) ---------- */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already a user?</Text>
            <TouchableOpacity
              style={styles.loginButton} // pill‑shaped button style
              onPress={() => router.push('/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
          {/* ------------------------------------------------------- */}
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
  additionalText: {
    marginBottom: 12,
    marginTop: 8,
    color: Colors.textSecondary,
  },
  highlight: {
    color: '#10DBB6',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0.68,
    borderRadius: 16,
    height: 68,
    justifyContent: 'center',
    marginBottom: 50,
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 10,
    color: Colors.textPrimary,
    fontFamily: 'Barlow_400Regular',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    left: 18,
    fontFamily: 'Barlow_400Regular',
    backgroundColor: Colors.background,
    paddingHorizontal: 4,
    zIndex: 1,
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
    marginTop: 10,
  },

  // ----- NEW STYLES FOR LOGIN ROW -----
  loginRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,          // space above the row
    marginBottom: 10,
  },
  loginText: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.textSecondary,
    marginTop: 4,         // space between text and button
  },
  loginButton: {
    borderWidth: 1.2,
    borderColor: Colors.textSecondary,
    borderRadius: 30,       // pill shape
    paddingVertical: 14,
    backgroundColor: 'transparent',
    marginTop: 12,           // space above the button
    width: '96%',
  },
  loginButtonText: {
    fontFamily: 'Onest_500Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  // ---------------------------------
});