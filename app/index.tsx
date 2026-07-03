import {
  Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold,
} from '@expo-google-fonts/onest';
import {
  PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { supabase } from '../lib/supabase';
import Onboarding from './Onboarding';

export default function App() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    Font.loadAsync({
      PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_500Medium,
      Onest_700Bold, Onest_400Regular, Onest_600SemiBold, Onest_500Medium,
    }).then(() => setFontsLoaded(true));

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('./main');
      setCheckingSession(false);
    });
  }, []);

  if (!fontsLoaded || checkingSession) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gradientStart} />
      </View>
    );
  }

  return <Onboarding onFinish={() => router.push('./signup')} />;
}