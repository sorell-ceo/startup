// src/screens/SignupScreen.js
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState(null); // null | 'checking' | 'available' | 'taken' | 'invalid'

  const { signUp } = useAuth();

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
    }, 500); // wait 500ms after typing stops before checking

    return () => clearTimeout(timeout);
  }, [username]);

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
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join with your institutional email</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {renderUsernameHint()}

      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="College Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 40 },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  hintChecking: { color: '#7f8c8d', fontSize: 13, marginBottom: 10, marginLeft: 4 },
  hintAvailable: { color: '#27ae60', fontSize: 13, marginBottom: 10, marginLeft: 4, fontWeight: '600' },
  hintTaken: { color: '#e74c3c', fontSize: 13, marginBottom: 10, marginLeft: 4, fontWeight: '600' },
  signupButton: { backgroundColor: '#3498db', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButton: { paddingVertical: 15, alignItems: 'center', marginTop: 10 },
  backButtonText: { color: '#3498db', fontSize: 15, fontWeight: '500' },
});