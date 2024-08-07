import { Text as NativeText, TextProps as NativeTextProps, StyleSheet } from 'react-native';

import { theme } from '~/theme';

export const Text = ({ children, style, ...props }: NativeTextProps) => {
  return (
    <NativeText style={[styles.text, style]} {...props}>
      {children}
    </NativeText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.dark,
    fontSize: theme.fontSizes.md,
  },
});
