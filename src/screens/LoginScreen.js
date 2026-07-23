// src/screens/LoginScreen.js
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { StackSansHeadline_400Regular, StackSansHeadline_600SemiBold, useFonts } from '@expo-google-fonts/stack-sans-headline';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet, Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const [fontsLoaded] = useFonts({
    StackSansHeadline_400Regular,
    StackSansHeadline_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#3ADBB8" />
      </View>
    );
  }

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
  <Text style={styles.title}>univerce</Text>
  <Text style={styles.subtitle}>Login to your account</Text>

  <TextInput
    style={styles.input}
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
    style={styles.loginButton}
    onPress={handleLogin}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#242424" />
    ) : (
      <Text style={styles.buttonText}>Login</Text>
    )}
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.signupButton}
    onPress={() => navigation.navigate('Signup')}
    disabled={loading}
  >
    <Text style={styles.signupButtonText}>Create New Account</Text>
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
  fontSize: 38,
  color: '#FFFFFF',
  textAlign: 'center',
  letterSpacing: -2,
  marginBottom: 8,

  textShadowColor: 'transparent',
  textShadowRadius: 0,
  textShadowOffset: { width: 0, height: 0 },
},

  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.68)',
    textAlign: 'center',
    marginBottom: 36,
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

  loginButton: {
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

  signupButton: {
    marginTop: 16,

    borderRadius: 16,

    paddingVertical: 16,

    alignItems: 'center',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.12)',

    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  signupButtonText: {
    fontFamily: 'StackSansHeadline_400Regular',

    color: '#e0fcf4',

    fontSize: 14,

    letterSpacing: 0.4,
  },

});