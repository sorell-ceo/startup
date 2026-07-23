// src/constants/theme.js
//
// Central design tokens for the Univerce dark theme.
// Pulled directly from the marketing site's CSS custom properties so the
// app and landing page stay visually consistent.
//
// Usage:
//   import { colors, fonts, radii } from '../constants/theme';
//   <View style={{ backgroundColor: colors.ink }} />
//   <Text style={{ fontFamily: fonts.display.bold }} />

export const colors = {
  // Backgrounds
  ink: '#0A0A0F',       // primary app background
  ink2: '#111118',      // card / elevated surface
  ink3: '#17171F',      // deeper elevated surface (modals, sheets)

  // Text
  paper: '#F5F3FF',     // primary text on dark backgrounds
  paperDim: '#B8B4CC',  // secondary/muted text on dark backgrounds

  // Accents
  violet: '#7C5CFC',
  violetDim: '#4A3B99',
  mint: '#3ADBB8',
  coral: '#FF6B8B',

  // Borders / dividers
  line: 'rgba(245,243,255,0.12)',
  lineSoft: 'rgba(245,243,255,0.06)',

  // Light-theme leftovers still used by not-yet-migrated screens —
  // keep these while screens are converted one at a time.
  legacyBg: '#ffffff',
  legacyText: '#2c3e50',
  legacyMuted: '#7f8c8d',
  legacyBlue: '#3498db',
  legacyRed: '#e74c3c',
};

export const fonts = {
  // Body copy — Manrope, matches the landing page's --body
  body: {
    extraLight: 'Manrope-ExtraLight',
    light: 'Manrope-Light',
    regular: 'Manrope-Regular',
    medium: 'Manrope-Medium',
    semiBold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
    extraBold: 'Manrope-ExtraBold',
  },
  // Display / headings — StackSansHeadline, matches the landing page's --display role
  display: {
    extraLight: 'StackSansHeadline-ExtraLight',
    light: 'StackSansHeadline-Light',
    regular: 'StackSansHeadline-Regular',
    medium: 'StackSansHeadline-Medium',
    semiBold: 'StackSansHeadline-SemiBold',
    bold: 'StackSansHeadline-Bold',
  },
  // No true mono font file is bundled yet (landing page uses JetBrains Mono,
  // which isn't in assets/fonts/). Until that's added, fake a "mono" feel with
  // Manrope + wide letterSpacing — see `monoStyle` helper below.
};

// Helper for faux-mono labels (UNIVERCE ID, barcode captions, eyebrow tags)
// until a real monospace font asset is added.
export const monoStyle = {
  fontFamily: fonts.body.semiBold,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 32,
};