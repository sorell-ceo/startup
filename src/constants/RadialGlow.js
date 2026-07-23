// src/components/RadialGlow.js
//
// A soft radial-gradient glow blob, matching the landing page's
// `.id-card::before` / `.glow-field` radial-gradient effect.
// React Native has no native radial-gradient or CSS blur, so this uses
// react-native-svg's <RadialGradient> for an accurate soft-edged glow.
//
// Install first:  npx expo install react-native-svg
//
// Usage:
//   <RadialGlow color="#3ADBB8" size={260} style={{ top: -60, left: -30 }} />
//
// `style` accepts position props (top/left/right/bottom) to place the glow;
// the component itself is absolutely positioned so it layers behind sibling
// content — make sure the parent has `overflow: 'hidden'` if you want it
// clipped to a card's rounded corners (as ProfileScreen's idCard does).

import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Rect, Stop, RadialGradient as SvgRadialGradient } from 'react-native-svg';

export default function RadialGlow({ color = '#3ADBB8', size = 450, opacity = 0.55, style }) {
  const gradientId = 'glow';

  return (
    <View style={[styles.wrap, { width: size, height: size }, style]} pointerEvents="none">
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgRadialGradient
            id={gradientId}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="0%" stopColor={color} stopOpacity={opacity * 0.55} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>
        <Rect x={-60} y={-40} width={size} height={size} fill={`url(#${gradientId})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    zIndex: 0,
  },
});