// App.js
import { StackSansHeadline_700Bold } from '@expo-google-fonts/stack-sans-headline';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import MainTabs from './src/navigation/MainTabs';
import CreatePostScreen from './src/screens/CreatePostScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/Signupscreen';
import SplashAnimation from './src/screens/SplashAnimation';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: '#7f8c8d', fontFamily: 'Manrope-Regular' }}>
          Loading your session...
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
  screenOptions={{
    headerShown: false,
    contentStyle: { backgroundColor: '#0A0A0F' },
  }}
>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  // Splash plays first, before AuthProvider/NavigationContainer even mount.
  // This matches your Figma sequence exactly: u -> univerce. -> settle,
  // then hands off to your existing auth-gated navigation, untouched.
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinished = useCallback(() => {
    setSplashDone(true);
  }, []);

  // Load Manrope weights + Gloock + Stack Sans Headline app-wide. Loading happens
  // in parallel with the splash animation, so by the time splash finishes this
  // should already be resolved in almost all cases; if not, fontsLoaded gates
  // the real UI below.
  const [fontsLoaded] = useFonts({
    'Manrope-ExtraLight': require('./assets/fonts/Manrope-ExtraLight.ttf'),
    'Manrope-Light': require('./assets/fonts/Manrope-Light.ttf'),
    'Manrope-Regular': require('./assets/fonts/Manrope-Regular.ttf'),
    'Manrope-Medium': require('./assets/fonts/Manrope-Medium.ttf'),
    'Manrope-SemiBold': require('./assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope-Bold': require('./assets/fonts/Manrope-Bold.ttf'),
    'Manrope-ExtraBold': require('./assets/fonts/Manrope-ExtraBold.ttf'),
    'Gloock-Regular': require('./assets/fonts/Gloock-Regular.ttf'),
    StackSansHeadline_700Bold,
  });

  if (!splashDone) {
    return <SplashAnimation onFinished={handleSplashFinished} />;
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0F' }}>
        <ActivityIndicator size="large" color="#7C5CFC" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}