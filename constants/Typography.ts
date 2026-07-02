// constants/Typography.ts
import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Typography = StyleSheet.create({
  // 👑 Headings
  h1: {
    fontFamily: 'Onest_700Bold',
    fontSize: 34,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'Onest_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  h3: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 28,
  },

  // 📝 Body
  body: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
  },

  // 🔤 Caption / Small text
  caption: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },

  // 🎯 Buttons
  button: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
});