import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../constants/colors';
import { fontFamily } from '../constants/fonts';
import { tapHaptic } from '../utils/haptics';

const FADE_WIDTH = 28;

// Horizontally scrolling filter pills (Following / Social Event / Hackathons / Clubs).
// Selecting a pill is what should trigger your backend fetch for that tag -
// see the onSelect handler wired up in screens/HomeScreen.js.
export default function FilterPills({ filters, selectedId, onSelect }) {
  const handleSelect = (id) => {
    tapHaptic();
    onSelect && onSelect(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {filters.map((filter) => {
          const isSelected = filter.id === selectedId;
          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => handleSelect(filter.id)}
              activeOpacity={0.8}
              style={[styles.pill, isSelected && styles.pillSelected]}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {filter.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Feather/fade overlays at each edge - purely decorative, touches pass through */}
      <LinearGradient
        pointerEvents="none"
        colors={[colors.background, `${colors.background}00`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, { left: 0 }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[`${colors.background}00`, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, { right: 0 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    marginTop: 18,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
  },
  pillSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  pillText: {
    fontFamily: fontFamily.headline,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  pillTextSelected: {
    color: colors.background,
  },
  fade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: FADE_WIDTH,
  },
});
