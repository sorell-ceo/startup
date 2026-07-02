// App.tsx
import { Onest_700Bold } from '@expo-google-fonts/onest';
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Colors } from './constants/Colors';
import Main from './screens/Main';
import Onboarding from './screens/Onboarding';

export default function App() {
  // State 1: Are the fonts loaded?
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // State 2: Is the app checking storage?
  const [isLoading, setIsLoading] = useState(true);
  
  // State 3: Should we show onboarding or feed?
  const [showOnboarding, setShowOnboarding] = useState(false);

  // --- 1. LOAD FONTS (Runs once when app starts) ---
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        PlusJakartaSans_400Regular,
        PlusJakartaSans_600SemiBold,
        Onest_700Bold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // --- 2. CHECK STORAGE (Runs once fonts are loaded) ---
  useEffect(() => {
    if (!fontsLoaded) return; // Wait for fonts to load first

    async function checkOnboarding() {
      try {
        const value = await AsyncStorage.getItem('@onboarding_done');
        if (value === 'true') {
          setShowOnboarding(false); // ✅ Already saw onboarding
        } else {
          setShowOnboarding(true); // 👋 First time
        }
      } catch (error) {
        console.log('Storage error', error);
        setShowOnboarding(true); // On error, show onboarding just to be safe
      } finally {
        setIsLoading(false); // Done loading
      }
    }
    checkOnboarding();
  }, [fontsLoaded]); // 👈 Re-run when fonts finish loading

  // --- 3. HANDLE ONBOARDING FINISH (Save & switch to Feed) ---
  const handleOnboardingFinish = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_done', 'true');
      setShowOnboarding(false); // 👈 Switch to Feed
    } catch (error) {
      console.log('Error saving', error);
    }
  };

  // --- 4. DEBUG: Reset onboarding (so you can test again) ---
  const handleReset = async () => {
    await AsyncStorage.removeItem('@onboarding_done');
    setShowOnboarding(true); // 👈 Go back to Onboarding
  };

  // --- 5. LOADING SCREEN (While fonts/storage load) ---
  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gradientStart} />
        <Text style={{ color: Colors.textSecondary, marginTop: 20, fontFamily: 'PlusJakartaSans_400Regular' }}>
          Loading your campus...
        </Text>
      </View>
    );
  }

  // --- 6. DECISION: Show Onboarding OR Feed ---
  if (showOnboarding) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  } else {
    return <Main onReset={handleReset} />;
  }
}