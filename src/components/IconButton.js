import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontFamily } from '../constants/fonts';
import { tapHaptic } from '../utils/haptics';

// Generic pressable icon wrapper used everywhere an icon needs to be tappable
// (header bell/DM, post actions, floating nav). Fires a light haptic on every
// press automatically, so screens never have to think about it individually.
//
// `icon` accepts any renderable node - drop in your own offline icon asset,
// e.g. icon={<Image source={require('../assets/icons/heart.png')} style={{ width: 20, height: 20 }} />}
// and it renders in place of the placeholder circle shown below.
export default function IconButton({ icon, size = 24, badge, onPress, style }) {
  const handlePress = () => {
    tapHaptic();
    onPress && onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.wrapper, style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {icon || (
          <View
            style={[
              styles.placeholder,
              { width: size * 0.7, height: size * 0.7, borderRadius: size / 2 },
            ]}
          />
        )}
      </View>

      {badge != null && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    borderWidth: 1.5,
    borderColor: colors.textMuted,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.rivalryRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.text,
    fontSize: 9,
    fontFamily: fontFamily.bold,
  },
});
