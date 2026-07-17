import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import colors from '../constants/colors';
import IconButton from './IconButton';

// Tabs: home, search, rivalry/trophy, events, profile - matches the 5 icons
// in the Figma floating nav bar. Rename/reorder as needed.
const TABS = ['home', 'search', 'trophy', 'events', 'profile'];

// Persistent floating tab bar with a glass/blur backing, overlaid above all
// screen content. In a full app this is what a custom tabBar for React
// Navigation's bottom tabs would render.
export default function FloatingNavBar({ activeTab, onTabPress }) {
  return (
    <BlurView intensity={50} tint="dark" style={styles.wrapper}>
      <View style={styles.inner}>
        {TABS.map((key) => (
          <IconButton
            key={key}
            icon={null} // TODO: swap for your offline icon matching `key`
            size={22}
            onPress={() => onTabPress && onTabPress(key)}
            style={activeTab === key ? styles.activeIcon : null}
          />
        ))}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    gap: 22,
    backgroundColor: colors.glassFill,
  },
  activeIcon: {
    opacity: 1,
  },
});
