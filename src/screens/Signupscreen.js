// src/screens/SignupScreen.js
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { StackSansHeadline_400Regular, StackSansHeadline_600SemiBold, useFonts } from '@expo-google-fonts/stack-sans-headline';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const ALLOWED_DOMAINS = ['@cumail.in', '@student.amity.edu', '@chitkara.edu.in', '.ac.in'];
const DEVELOPER_EXCEPTION = ['anuraglodhi2008@gmail.com', 'hr.sorell@gmail.com'];

const isAllowedEmail = (email) => {
  const lower = email.toLowerCase().trim();
  if (DEVELOPER_EXCEPTION.includes(lower)) return true;
  return ALLOWED_DOMAINS.some((domain) => lower.endsWith(domain));
};
const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | 'checking' | 'available' | 'taken' | 'invalid'

  const { signUp } = useAuth();

  const [fontsLoaded] = useFonts({
    StackSansHeadline_400Regular,
    StackSansHeadline_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  // Debounced live username check
  useEffect(() => {
    const trimmed = username.trim();

    if (trimmed.length === 0) {
      setUsernameStatus(null);
      return;
    }

    if (!isValidUsername(trimmed)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');

    const timeout = setTimeout(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', trimmed)
        .maybeSingle();

      if (error) {
        console.error('Username check error:', error);
        setUsernameStatus(null);
        return;
      }

      setUsernameStatus(data ? 'taken' : 'available');
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#3ADBB8" />
      </View>
    );
  }

  const renderUsernameHint = () => {
    if (usernameStatus === 'checking') {
      return <Text style={styles.hintChecking}>Checking availability...</Text>;
    }
    if (usernameStatus === 'available') {
      return <Text style={styles.hintAvailable}>✓ Username available</Text>;
    }
    if (usernameStatus === 'taken') {
      return <Text style={styles.hintTaken}>✗ Username already taken</Text>;
    }
    if (usernameStatus === 'invalid') {
      return <Text style={styles.hintTaken}>3-20 chars, letters/numbers/underscore only</Text>;
    }
    return null;
  };

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!isValidUsername(username.trim())) {
      Alert.alert('Invalid Username', 'Username must be 3-20 characters, letters, numbers, or underscores only.');
      return;
    }

    if (usernameStatus === 'taken') {
      Alert.alert('Username Taken', 'That username is already in use. Try another.');
      return;
    }

    if (!isAllowedEmail(email)) {
      Alert.alert('Invalid Email', 'Please use your institutional (.edu) email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, username.trim());

      Alert.alert(
        'Account Created!',
        'Check your inbox to verify your email if required, then log in.'
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <ImageBackground
    source={require('../../assets/images/login-bg.png')}
    resizeMode="cover"
    style={styles.background}
  >
    <View style={styles.overlay}>
      <BlurView
        intensity={130}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={styles.card}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join with your institutional email</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        {renderUsernameHint()}

        <TextInput
          style={[styles.input, { marginTop: 15 }]}
          placeholder="College Email"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#242424" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  </ImageBackground>
);
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,8,12,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },

  container: {
    flex: 1,
  },

  card: {
  borderRadius: 28,
  overflow: 'hidden',
  padding: 28,

  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',

  backgroundColor: 'rgba(255,255,255,0.03)',

  shadowColor: '#000',
  shadowOpacity: 0.35,
  shadowRadius: 30,
  shadowOffset: { width: 0, height: 18 },
  elevation: 20,
},

  title: {
    fontFamily: 'Gloock-Regular',
    fontSize: 32,
    color: '#f0f0f0',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.68)',
    textAlign: 'center',
    marginBottom: 32,
  },

  input: {
    fontFamily: 'Manrope_400Regular',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 17,
    marginBottom: 16,
    fontSize: 14,
    color: '#FFFFFF',
  },

  hintChecking: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 10, marginLeft: 4 },
  hintAvailable: { color: '#53DFC1', fontSize: 13, marginBottom: 10, marginLeft: 4, fontWeight: '600' },
  hintTaken: { color: '#e74c3c', fontSize: 13, marginBottom: 10, marginLeft: 4, fontWeight: '600' },

  signupButton: {
    marginTop: 12,
    backgroundColor: '#53DFC1',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',

    shadowColor: '#53DFC1',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonText: {
    fontFamily: 'StackSansHeadline_600SemiBold',
    color: '#1E1E1E',
    fontSize: 15,
    letterSpacing: -0.2,
  },

  backButton: {
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  backButtonText: {
    fontFamily: 'StackSansHeadline_400Regular',
    color: '#e0fcf4',
    fontSize: 14,
    letterSpacing: 0.4,
  },
});