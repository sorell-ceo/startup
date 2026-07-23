// src/screens/SplashAnimation.js
//
// Plays your actual Lottie export (assets/lottie/splash.json) natively.
// This replaces the earlier hand-ported Reanimated version — no more
// approximating your curves, this plays the exact keyframes you exported.
//
// Install first:
//   npx expo install lottie-react-native
//
// Note: this file's animation is pure vector shapes (no fonts/images needed),
// so you do NOT need to load Gloock-Regular for this specific component.

import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

const COLORS = {
  bg: '#0A0A0F',
};

export default function SplashAnimation({ onFinished }) {
  const animRef = useRef(null);

  const handleAnimationFinish = useCallback(() => {
    SplashScreen.hideAsync().catch(() => {});
    onFinished && onFinished();
  }, [onFinished]);

  return (
    <View
      style={styles.container}
      onLayout={() => {
        // native splash.png (matching this animation's first frame) hides
        // right as this view is ready to take over — avoids any visible gap
        SplashScreen.hideAsync().catch(() => {});
      }}
    >
      <LottieView
        ref={animRef}
        source={require('../../assets/lottie/splash.json')}
        autoPlay
        loop={false}
        speed={1}
        resizeMode="contain"
        style={styles.lottie}
        onAnimationFinish={handleAnimationFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});