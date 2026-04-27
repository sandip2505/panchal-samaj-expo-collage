import { Platform } from 'react-native';

export const COLORS = {
  primary: '#e28867',
  secondary: '#4CAF50',
  accent: '#FFC107',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  background: '#FAFAFA',
  card: '#FFFFFF',
  border: '#E0E0E0',
};

export const Colors = {
  light: {
    text: COLORS.black,
    background: COLORS.background,
    tint: COLORS.primary,
    icon: COLORS.gray,
    tabIconDefault: COLORS.gray,
    tabIconSelected: COLORS.primary,
    card: COLORS.card,
    border: COLORS.border,
  },
  dark: {
    text: COLORS.white,
    background: COLORS.darkGray,
    tint: COLORS.primary,
    icon: COLORS.gray,
    tabIconDefault: COLORS.gray,
    tabIconSelected: COLORS.primary,
    card: '#1e1e1e',
    border: '#333333',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
