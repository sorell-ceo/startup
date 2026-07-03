// constants/Typography.ts
import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Typography = StyleSheet.create({
  h1: {
    fontFamily: 'Onest_500Medium',
    fontSize: 36,
    color: Colors.textPrimary,
    letterSpacing: -2,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'Onest_700Bold',
    fontSize: 50,
    color: Colors.textPrimary,
    letterSpacing: -0.9,
    lineHeight: 34,
  },
  h3: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    letterSpacing: -0.7,
  },
  bodyBold: {
    fontFamily: 'Onest_600SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  button: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
});