// screens/Feed.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface FeedProps {
  onReset: () => void; // 👈 Debug: go back to onboarding
}

export default function Feed({ onReset }: FeedProps) {
  return (
    <View style={styles.container}>
      <Text style={[Typography.h1, styles.titleExtra]}>Your College. Unfiltered.</Text>
      <Text style={[Typography.body, { marginTop: 10 }]}>You're in. Go cause trouble.</Text>
      
      {/* 👇 Debug button - delete this when you're done testing */}
      <TouchableOpacity onPress={onReset} style={{ marginTop: 40 }}>
        <Text style={[Typography.caption, { color: Colors.gradientStart }]}>
          Reset Onboarding (Debug)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleExtra: {
    textAlign: 'center',
  },
});