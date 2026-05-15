import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#0F0F0F',    // Luxury Black
  secondary: '#E5E2D9',  // Warm Stone
  background: '#F0EEE6', // Soft Ivory
  accent: '#C5A47E',     // Muted Gold (for CTA highlights)
  error: '#BC2C2C',
  textMain: '#1A1A1A',
  textMuted: '#626262',
  white: '#FFFFFF',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 0, // Neubrutalist sharp edges or use 12 for modern soft
  padding: 24,
  width,
  height,
};

export const FONTS = {
  bold: 'GeneralSans-Bold',
  semibold: 'GeneralSans-Semibold',
  medium: 'GeneralSans-Medium',
  regular: 'GeneralSans-Regular',
};