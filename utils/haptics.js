// utils/haptics.js
import * as Haptics from 'expo-haptics';

// Light tap feedback fired on every icon/pill press across the app.
// Wrapped in a catch because haptics can throw on devices/simulators that
// don't support it (some Android emulators, web preview, etc).
export const tapHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};
