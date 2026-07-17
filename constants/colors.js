// constants/colors.js
// Single source of truth for the app's color palette.
// Change a value here and it updates everywhere that color is used - nothing
// else in the app should ever hardcode a hex value directly.

export const colors = {
  // Core surfaces
  background: '#0D0D12',
  surface: '#16161E',                    // cards / image placeholders sitting slightly above the background
  glassFill: 'rgba(22, 22, 30, 0.55)',   // translucent tint layered on top of BlurView for the glass effect
  glassBorder: 'rgba(245, 240, 230, 0.08)',

  // Text
  text: '#F5F0E6',
  textMuted: '#8F8B82',                  // muted version of `text` - @handles, timestamps, meta info
  textFaint: 'rgba(245, 240, 230, 0.4)',

  // Brand / logo
  logoBase: '#F5F0E6',
  logoAccent: '#C9A65C',                 // the gold "c" in "univerce"

  // Campus rivalry
  rivalryRed: '#FF5A4E',
  rivalryPurple: '#6E5BFF',

  // Utility
  verifiedBadge: '#C9A65C',
};

export default colors;
