import { View as NativeView, ViewProps as NativeViewProps, StyleSheet } from 'react-native';

export const View = ({ children, style, ...props }: NativeViewProps) => {
  return (
    <NativeView style={[styles.view, style]} {...props}>
      {children}
    </NativeView>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'transparent',
  },
});
