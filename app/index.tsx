import { Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold } from '@expo-google-fonts/barlow';
import { GoogleSansFlex_400Regular, GoogleSansFlex_500Medium, GoogleSansFlex_600SemiBold } from '@expo-google-fonts/google-sans-flex';
import {
  Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold,
} from '@expo-google-fonts/onest';
import {
  PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/Colors';
import Onboarding from './Onboarding';

export default function App() {
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_500Medium,
    Onest_700Bold,
    Onest_400Regular,
    Onest_600SemiBold,
    Onest_500Medium,
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    GoogleSansFlex_400Regular,
    GoogleSansFlex_500Medium,
    GoogleSansFlex_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      console.warn('Font loading error:', fontError);
    }
  }, [fontError]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gradientStart} />
      </View>
    );
  }

  // NEW FLOW: Onboarding → Create Profile → Signup → OTP → ...
  return <Onboarding onFinish={() => router.push('./create-profile')} />;
}