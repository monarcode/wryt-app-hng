const colors = {
  primary: '#2D2966',
  secondary: '#F37021',
  dark: '#302B27',
  light: '#F5F3F5',
  gray: '#D9D5D4',
  neutral: {
    100: '#776D6A',
    200: '#5C4F4A',
    300: '#413C3A',
  },
} as const;

const fontFamily = {
  regular: 'Quicksand_400Regular',
  medium: 'Quicksand_500Medium',
  semiBold: 'Quicksand_600SemiBold',
  light: 'Quicksand_300Light',
};

const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
} as const;

export const theme = {
  colors,
  fontFamily,
  fontSizes,
};
