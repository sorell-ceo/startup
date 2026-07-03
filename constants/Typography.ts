// constants/Typography.ts
import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Typography = StyleSheet.create({
  h1: {
    fontFamily: 'Onest_500Medium',
    fontSize: 28,
    color: Colors.textPrimary,
    letterSpacing: -2,
    lineHeight: 30,
  },
  h2: {
    fontFamily: 'Onest_500Medium',
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
    impBody: {
    fontFamily: 'Onest_400Regular',
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    letterSpacing: -0.3,
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
    fontFamily: 'Onest_600SemiBold',
    fontSize: 16,
    color: Colors.buttonText,
    letterSpacing: -0.5,
  },
});