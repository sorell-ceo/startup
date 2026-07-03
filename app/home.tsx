import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={Typography.h1}>Welcome to YappOut 🎉</Text>
      <Text style={Typography.body}>This is your campus feed (UI mock).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});