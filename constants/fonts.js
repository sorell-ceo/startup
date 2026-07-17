// constants/fonts.js
// Central font config - change values here and the whole app updates.
//
//   Body copy              -> Manrope           (Google Font, loaded automatically below)
//   Logo wordmark           -> Gloock            (Google Font, loaded automatically below)
//   Pill filters / headline -> "Stack Sans Headline" (NOT a Google Font - see below)
//
// "Stack Sans Headline" needs its actual font file since it isn't on Google Fonts:
//   1. Drop your .ttf/.otf into assets/fonts/ (e.g. StackSansHeadline-Regular.otf)
//   2. Uncomment the `StackSansHeadline: require(...)` line in useAppFonts() below
//   3. Change `headline` below from 'Manrope_600SemiBold' to 'StackSansHeadline'
// Until you do that, `headline` falls back to Manrope SemiBold so the app runs
// out of the box without crashing on a missing file.

import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { Gloock_400Regular } from '@expo-google-fonts/gloock';

export const fontFamily = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extraBold: 'Manrope_800ExtraBold',

  headline: 'StackSansHeadline', // TODO: swap to 'StackSansHeadline' once the font file is added (see note above)

  logo: 'Gloock_400Regular',
};

export function useAppFonts() {
  return useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Gloock_400Regular,
    StackSansHeadline: require('../assets/fonts/StackSansHeadline-Regular.ttf'),
  });
}
