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
    // --- Google Fonts (npm package, no local files needed) ---
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

    // --- Local files from assets/fonts/ ---
    // 42dot Sans (static weights only — variable .ttf intentionally excluded, see note above)
    '42dotSans-Light': require('../assets/fonts/42dotSans-Light.ttf'),
    '42dotSans-Regular': require('../assets/fonts/42dotSans-Regular.ttf'),
    '42dotSans-Medium': require('../assets/fonts/42dotSans-Medium.ttf'),
    '42dotSans-Bold': require('../assets/fonts/42dotSans-Bold.ttf'),
    '42dotSans-ExtraBold': require('../assets/fonts/42dotSans-ExtraBold.ttf'),

    // Funnel Sans (italics excluded per request)
    'FunnelSans-Light': require('../assets/fonts/FunnelSans-Light.ttf'),
    'FunnelSans-Regular': require('../assets/fonts/FunnelSans-Regular.ttf'),
    'FunnelSans-Medium': require('../assets/fonts/FunnelSans-Medium.ttf'),
    'FunnelSans-Bold': require('../assets/fonts/FunnelSans-Bold.ttf'),
    'FunnelSans-ExtraBold': require('../assets/fonts/FunnelSans-ExtraBold.ttf'),

    //Host Grotesk (italics excluded per request)
    'HostGrotesk-Light': require('../assets/fonts/HostGrotesk-Light.ttf'),
    'HostGrotesk-Regular': require('../assets/fonts/HostGrotesk-Regular.ttf'),
    'HostGrotesk-Medium': require('../assets/fonts/HostGrotesk-Medium.ttf'),
    'HostGrotesk-Bold': require('../assets/fonts/HostGrotesk-Bold.ttf'),
    'HostGrotesk-ExtraBold': require('../assets/fonts/HostGrotesk-ExtraBold.ttf'),
    'HostGrotesk-SemiBold': require('../assets/fonts/HostGrotesk-SemiBold.ttf'),

    //LTInstitute-1 Font
    'LTInstitute-1-Regular': require('../assets/fonts/LTInstitute-1.otf'),

    //Neutral Sans (italics excluded per request)
    'NeutralSans-Regular': require('../assets/fonts/NeutralSans-Regular.otf'),
    'NeutralSans-Meidum': require('../assets/fonts/NeutralSans-Meidum.otf'),
    'NeutralSans-Bold': require('../assets/fonts/NeutralSans-Bold.otf'),

    //OakSans (italics excluded per request)
    'OakSans-Regular': require('../assets/fonts/OakSans-Regular.ttf'),
    'OakSans-Medium': require('../assets/fonts/OakSans-Medium.ttf'),
    'OakSans-Bold': require('../assets/fonts/OakSans-Bold.ttf'),

    //Rena-Regular Font
    'Rena-Regular': require('../assets/fonts/Rena-Regular.ttf'),
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