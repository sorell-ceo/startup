import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import colors from '../constants/colors';
import { fontFamily } from '../constants/fonts';
import IconButton from './IconButton';
import { tapHaptic } from '../utils/haptics';

// Top app bar: Post button (left) - "univerce" wordmark (center) - notifications
// + DMs (right). Glass/blur background per the Figma spec.
export default function GlassHeader({ notifCount = 0, dmCount = 0, onPostPress, onNotifPress, onDmPress }) {
  const handlePostPress = () => {
    tapHaptic();
    onPostPress && onPostPress();
  };

  return (
    <BlurView intensity={40} tint="dark" style={styles.wrapper}>
      <View style={styles.inner}>
        {/* Left: Post button */}
        <TouchableOpacity style={styles.postButton} onPress={handlePostPress} activeOpacity={0.7}>
          <Text style={styles.postIcon}>+</Text>
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>

        {/* Center: "univerce" wordmark - Gloock font, gold "c" */}
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>univer</Text>
          <Text style={[styles.logoText, styles.logoAccent]}>c</Text>
          <Text style={styles.logoText}>e</Text>
        </View>

        {/* Right: Notifications + DMs */}
        <View style={styles.iconsRow}>
          {/* TODO: pass your offline bell icon, e.g.
              icon={<Image source={require('../assets/icons/bell.png')} style={{ width: 22, height: 22 }} />} */}
          <IconButton icon={null} size={22} badge={notifCount} onPress={onNotifPress} />
          {/* TODO: same for the paper-plane / DM icon */}
          <IconButton icon={null} size={22} badge={dmCount} onPress={onDmPress} />
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    backgroundColor: colors.glassFill,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  postIcon: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fontFamily.bold,
    marginTop: -1,
  },
  postText: {
    color: colors.text,
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    fontFamily: fontFamily.logo,
    fontSize: 22,
    color: colors.logoBase,
  },
  logoAccent: {
    color: colors.logoAccent,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
});
